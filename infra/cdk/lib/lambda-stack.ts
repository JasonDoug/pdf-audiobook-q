import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

interface LambdaStackProps extends cdk.StackProps {
  bucket: s3.Bucket;
  table: dynamodb.Table;
}

export class LambdaStack extends cdk.Stack {
  public readonly functions: { [key: string]: lambda.Function };

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const lambdaRole = new iam.Role(this, 'LambdaExecutionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
      ],
      inlinePolicies: {
        S3Access: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ['s3:GetObject', 's3:PutObject'],
              resources: [`${props.bucket.bucketArn}/*`]
            })
          ]
        }),
        DynamoDBAccess: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ['dynamodb:GetItem', 'dynamodb:PutItem', 'dynamodb:UpdateItem'],
              resources: [props.table.tableArn]
            })
          ]
        }),
        StepFunctionsAccess: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ['states:SendTaskSuccess', 'states:SendTaskFailure'],
              resources: ['*']
            })
          ]
        })
      }
    });

    const functionNames = [
      'ExtractText', 'ExtractFigures', 'SemanticSegmentation', 'BeatSynthesis',
      'UserApproval', 'GenerateLectureScript', 'VerifyScripts', 'SynthesizeAudio', 'Finalize'
    ];

    this.functions = {};
    functionNames.forEach(name => {
      this.functions[name] = new lambda.Function(this, `${name}Function`, {
        runtime: lambda.Runtime.PYTHON_3_9,
        handler: 'index.handler',
        code: lambda.Code.fromInline(`
def handler(event, context):
    print(f"${name} function called with event: {event}")
    return {"statusCode": 200, "body": "Success"}
        `),
        role: lambdaRole,
        environment: {
          BUCKET_NAME: props.bucket.bucketName,
          TABLE_NAME: props.table.tableName
        }
      });
    });
  }
}
