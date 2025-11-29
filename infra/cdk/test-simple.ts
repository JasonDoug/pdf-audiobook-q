#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CoreStack } from './lib/core-stack';
import { LambdaStack } from './lib/lambda-stack';
import { OrchestrationStackSimple } from './lib/orchestration-stack-simple';

const app = new cdk.App();
const envName = 'dev';

const coreStack = new CoreStack(app, 'PdfAudiobookCoreStack', { envName });
const lambdaStack = new LambdaStack(app, 'PdfAudiobookLambdaStack', {
  bucket: coreStack.bucket,
  table: coreStack.table
});
const orchestrationStack = new OrchestrationStackSimple(app, 'PdfAudiobookOrchestrationStack', {
  lambdaFunctions: lambdaStack.functions,
  table: coreStack.table
});
