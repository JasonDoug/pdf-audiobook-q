import * as cdk from 'aws-cdk-lib';
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

interface OrchestrationStackProps extends cdk.StackProps {
  lambdaFunctions: { [key: string]: lambda.Function };
  table: dynamodb.Table;
}

export class OrchestrationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: OrchestrationStackProps) {
    super(scope, id, props);

    const stepFunctionsRole = new iam.Role(this, 'StepFunctionsRole', {
      assumedBy: new iam.ServicePrincipal('states.amazonaws.com'),
      inlinePolicies: {
        LambdaInvoke: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ['lambda:InvokeFunction'],
              resources: Object.values(props.lambdaFunctions).map(fn => fn.functionArn)
            })
          ]
        })
      }
    });

    const definitionTemplate = {
      "Comment": "PDF Audiobook Processing Pipeline",
      "StartAt": "ExtractTextTask",
      "States": {
        "ExtractTextTask": {
          "Type": "Task",
          "Resource": "arn:aws:states:::lambda:invoke",
          "Parameters": {
            "FunctionName": props.lambdaFunctions.ExtractText.functionArn,
            "Payload.$": "$"
          },
          "Next": "ExtractFiguresTask"
        },
        "ExtractFiguresTask": {
          "Type": "Task",
          "Resource": "arn:aws:states:::lambda:invoke",
          "Parameters": {
            "FunctionName": props.lambdaFunctions.ExtractFigures.functionArn,
            "Payload.$": "$"
          },
          "Next": "SemanticSegmentationTask"
        },
        "SemanticSegmentationTask": {
          "Type": "Task",
          "Resource": "arn:aws:states:::lambda:invoke",
          "Parameters": {
            "FunctionName": props.lambdaFunctions.SemanticSegmentation.functionArn,
            "Payload.$": "$"
          },
          "Next": "BeatSynthesisTask"
        },
        "BeatSynthesisTask": {
          "Type": "Task",
          "Resource": "arn:aws:states:::lambda:invoke",
          "Parameters": {
            "FunctionName": props.lambdaFunctions.BeatSynthesis.functionArn,
            "Payload.$": "$"
          },
          "Next": "UserApprovalWaitTask"
        },
        "UserApprovalWaitTask": {
          "Type": "Task",
          "Resource": "arn:aws:states:::lambda:invoke.waitForTaskToken",
          "Parameters": {
            "FunctionName": props.lambdaFunctions.UserApproval.functionArn,
            "Payload": {
              "taskToken.$": "$$.Task.Token",
              "input.$": "$"
            }
          },
          "Next": "GenerateLectureScriptTask"
        },
        "GenerateLectureScriptTask": {
          "Type": "Task",
          "Resource": "arn:aws:states:::lambda:invoke",
          "Parameters": {
            "FunctionName": props.lambdaFunctions.GenerateLectureScript.functionArn,
            "Payload.$": "$"
          },
          "Next": "VerifyScriptsTask"
        },
        "VerifyScriptsTask": {
          "Type": "Task",
          "Resource": "arn:aws:states:::lambda:invoke",
          "Parameters": {
            "FunctionName": props.lambdaFunctions.VerifyScripts.functionArn,
            "Payload.$": "$"
          },
          "Next": "SynthesizeAudioTask"
        },
        "SynthesizeAudioTask": {
          "Type": "Task",
          "Resource": "arn:aws:states:::lambda:invoke",
          "Parameters": {
            "FunctionName": props.lambdaFunctions.SynthesizeAudio.functionArn,
            "Payload.$": "$"
          },
          "Next": "FinalizeTask"
        },
        "FinalizeTask": {
          "Type": "Task",
          "Resource": "arn:aws:states:::lambda:invoke",
          "Parameters": {
            "FunctionName": props.lambdaFunctions.Finalize.functionArn,
            "Payload.$": "$"
          },
          "End": true
        }
      }
    };

    const stateMachine = new stepfunctions.StateMachine(this, 'OrchestratorStateMachine', {
      definitionBody: stepfunctions.DefinitionBody.fromString(JSON.stringify(definitionTemplate)),
      role: stepFunctionsRole
    });

    const apiLambda = new lambda.Function(this, 'ApiFunction', {
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
import json
import boto3

stepfunctions = boto3.client('stepfunctions')
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('${props.table.tableName}')

def handler(event, context):
    method = event['requestContext']['http']['method']
    path = event['requestContext']['http']['path']
    
    if method == 'POST' and path == '/upload':
        # Start Step Functions execution
        response = stepfunctions.start_execution(
            stateMachineArn='${stateMachine.stateMachineArn}',
            input=json.dumps(event.get('body', {}))
        )
        return {'statusCode': 200, 'body': json.dumps({'executionArn': response['executionArn']})}
    
    elif method == 'GET' and '/job/' in path:
        job_id = path.split('/job/')[1]
        response = table.get_item(Key={'id': job_id})
        return {'statusCode': 200, 'body': json.dumps(response.get('Item', {}))}
    
    elif method == 'POST' and '/approve' in path:
        # Handle beat approval
        return {'statusCode': 200, 'body': json.dumps({'message': 'Approved'})}
    
    return {'statusCode': 404, 'body': json.dumps({'error': 'Not found'})}
      `),
      environment: {
        STATE_MACHINE_ARN: stateMachine.stateMachineArn,
        TABLE_NAME: props.table.tableName
      }
    });

    apiLambda.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['states:StartExecution'],
      resources: [stateMachine.stateMachineArn]
    }));

    props.table.grantReadWriteData(apiLambda);

    const api = new apigateway.HttpApi(this, 'PdfAudiobookApi');
    
    const lambdaIntegration = new integrations.HttpLambdaIntegration('ApiIntegration', apiLambda);
    
    api.addRoutes({
      path: '/upload',
      methods: [apigateway.HttpMethod.POST],
      integration: lambdaIntegration
    });
    
    api.addRoutes({
      path: '/job/{id}',
      methods: [apigateway.HttpMethod.GET],
      integration: lambdaIntegration
    });
    
    api.addRoutes({
      path: '/job/{id}/beats/{beat_id}/approve',
      methods: [apigateway.HttpMethod.POST],
      integration: lambdaIntegration
    });

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url!,
      description: 'API Gateway URL'
    });

    new cdk.CfnOutput(this, 'StateMachineArn', {
      value: stateMachine.stateMachineArn,
      description: 'Step Functions State Machine ARN'
    });
  }
}
