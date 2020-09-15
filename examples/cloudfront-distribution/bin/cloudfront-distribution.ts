/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import allowedIPs from '../allowed-ips.json';
import { CloudFrontDistributionStack } from '../lib/cloudfront-distribution-stack';

const app = new cdk.App();

new CloudFrontDistributionStack(
  app,
  'CloudFrontDistributionStack',
  {
    description: 'An Amazon CloudFront distribution for a S3 static site.',
    allowedIPs,
    env: {
      account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
      region: 'us-east-1' // CloudFront distributions WAFs must be deployed to us-east-1 because CloudFront distributions are global resources.
    }
  }
);
