/**
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

import { SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { CloudFrontDistributionStack } from '../lib/cloudfront-distribution-stack';

test('CloudFrontDistributionStack Template Synths Without Errors', () => {
  const app = new cdk.App();
  const stack = new CloudFrontDistributionStack(app, 'Stack', {
    allowedIPs: [
      "35.180.0.0/16",
      "52.93.178.234/32",
      "52.94.76.0/22"
    ]
  });
  const assembly = SynthUtils.synthesize(stack);
  expect(assembly.messages).toEqual([]);
});
