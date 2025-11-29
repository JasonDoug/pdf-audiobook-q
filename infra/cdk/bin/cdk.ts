#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CoreStack } from '../lib/core-stack';
import { LambdaStack } from '../lib/lambda-stack';
import { OrchestrationStack } from '../lib/orchestration-stack';

const app = new cdk.App();
const envName = app.node.tryGetContext('env') || 'dev';

const coreStack = new CoreStack(app, 'PdfAudiobookCoreStack', { envName });
const lambdaStack = new LambdaStack(app, 'PdfAudiobookLambdaStack', {
  bucket: coreStack.bucket,
  table: coreStack.table
});
const orchestrationStack = new OrchestrationStack(app, 'PdfAudiobookOrchestrationStack', {
  lambdaFunctions: lambdaStack.functions,
  table: coreStack.table
});
