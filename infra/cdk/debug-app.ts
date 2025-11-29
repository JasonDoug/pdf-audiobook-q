#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CoreStack } from './lib/core-stack';

console.log('Creating app...');
const app = new cdk.App();
console.log('App created');

const envName = 'dev';
console.log('Creating core stack...');
const coreStack = new CoreStack(app, 'PdfAudiobookCoreStack', { envName });
console.log('Core stack created');

console.log('App setup complete');
