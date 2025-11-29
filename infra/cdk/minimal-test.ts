#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'MinimalStack');

new s3.Bucket(stack, 'TestBucket', {
  bucketName: 'minimal-test-bucket-12345'
});

console.log('App created successfully');
