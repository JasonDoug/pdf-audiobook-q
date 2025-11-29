#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    new s3.Bucket(this, 'TestBucket', {
      bucketName: 'test-bucket-12345',
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
  }
}

const app = new cdk.App();
new TestStack(app, 'TestStack');
