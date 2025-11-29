#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CoreStack } from './lib/core-stack';
import { LambdaStack } from './lib/lambda-stack';
import { OrchestrationStack } from './lib/orchestration-stack';
import * as fs from 'fs';

const app = new cdk.App();
const envName = 'dev';

console.log('Creating stacks...');

const coreStack = new CoreStack(app, 'PdfAudiobookCoreStack', { envName });
const lambdaStack = new LambdaStack(app, 'PdfAudiobookLambdaStack', {
  bucket: coreStack.bucket,
  table: coreStack.table
});
const orchestrationStack = new OrchestrationStack(app, 'PdfAudiobookOrchestrationStack', {
  lambdaFunctions: lambdaStack.functions,
  table: coreStack.table
});

console.log('Stacks created successfully');

// Generate CloudFormation templates
const assembly = app.synth();
console.log('Assembly synthesized');

// Write templates to files
fs.mkdirSync('./cloudformation-templates', { recursive: true });

for (const stack of assembly.stacks) {
  const template = JSON.stringify(stack.template, null, 2);
  fs.writeFileSync(`./cloudformation-templates/${stack.stackName}.json`, template);
  console.log(`Generated template for ${stack.stackName}`);
}

console.log('CloudFormation templates generated successfully!');
