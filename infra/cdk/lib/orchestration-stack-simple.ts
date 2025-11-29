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

export class OrchestrationStackSimple extends cdk.Stack {
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

    // Simple inline definition for testing
    const definition = {
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
          "End": true
        }
      }
    };

    const stateMachine = new stepfunctions.StateMachine(this, 'OrchestratorStateMachine', {
      definitionBody: stepfunctions.DefinitionBody.fromString(JSON.stringify(definition)),
      role: stepFunctionsRole
    });

    new cdk.CfnOutput(this, 'StateMachineArn', {
      value: stateMachine.stateMachineArn,
      description: 'Step Functions State Machine ARN'
    });
  }
}
