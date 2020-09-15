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

import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import { App, Stack } from '@aws-cdk/core';
import { AllowedIPsWaf, IPScope, IPv4 } from '../lib';

describe('AllowedIPsWaf', () => {
  test('IPSet is Created', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new AllowedIPsWaf(
      stack,
      'AllowedIPsWaf',
      {
        ipScope: IPScope.CLOUDFRONT,
        allowedIPs: [
          new IPv4('35.180.0.0/16'),
          new IPv4('52.93.178.234/32'),
          new IPv4('52.94.76.0/22')
        ]
      }
    );
    expectCDK(stack).to(haveResource('AWS::WAFv2::IPSet'));
  });

  test('WebACL is Created', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new AllowedIPsWaf(
      stack,
      'AllowedIPsWaf',
      {
        ipScope: IPScope.CLOUDFRONT,
        allowedIPs: [
          new IPv4('35.180.0.0/16'),
          new IPv4('52.93.178.234/32'),
          new IPv4('52.94.76.0/22')
        ]
      }
    );
    expectCDK(stack).to(haveResource('AWS::WAFv2::WebACL'));
  });

  test('AllowedIPsWaf webACLId is Provided', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    const allowedIPsWaf = new AllowedIPsWaf(
      stack,
      'AllowedIPsWaf',
      {
        ipScope: IPScope.CLOUDFRONT,
        allowedIPs: [
          new IPv4('35.180.0.0/16'),
          new IPv4('52.93.178.234/32'),
          new IPv4('52.94.76.0/22')
        ]
      }
    );
    expect(allowedIPsWaf.webACLId).toBeTruthy();
  });

  test('A Stack with an AllowedIPsWaf Synths Without Errors', () => {
    const app = new App();
    const stack = new Stack(app, 'Stack');
    new AllowedIPsWaf(
      stack,
      'AllowedIPsWaf',
      {
        ipScope: IPScope.CLOUDFRONT,
        allowedIPs: [
          new IPv4('35.180.0.0/16'),
          new IPv4('52.93.178.234/32'),
          new IPv4('52.94.76.0/22')
        ]
      }
    );
    const assembly = SynthUtils.synthesize(stack);
    expect(assembly.messages).toEqual([]);
  });
});
