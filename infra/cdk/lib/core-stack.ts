import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

interface CoreStackProps extends cdk.StackProps {
  envName: string;
}

export class CoreStack extends cdk.Stack {
  public readonly bucket: s3.Bucket;
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, props: CoreStackProps) {
    super(scope, id, props);

    this.bucket = new s3.Bucket(this, 'IngestBucket', {
      bucketName: `pdfaudiobook-ingest-${props.envName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });

    this.table = new dynamodb.Table(this, 'JobsTable', {
      tableName: 'pdfaudiobook-jobs',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
  }
}
