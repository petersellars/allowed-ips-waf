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

import * as cdk from '@aws-cdk/core';
import * as waf from '@aws-cdk/aws-wafv2';

export enum IPScope {
  CLOUDFRONT = 'CLOUDFRONT',
  REGIONAL = 'REGIONAL'
}

export class IPv4 {
  public readonly uniqueId: string;

  constructor(private readonly iPv4: string) {
    if (!cdk.Token.isUnresolved(iPv4)) {
      const cidrMatch = iPv4.match(/^(\d{1,3}\.){3}\d{1,3}(\/\d+)?$/);
      if (!cidrMatch) {
        throw new Error(`Invalid IPv4 CIDR: "${iPv4}"`);
      }
      if (!cidrMatch[2]) {
        throw new Error(`CIDR mask is missing in IPv4: "${iPv4}". Did you mean "${iPv4}/32"?`);
      }
    }
    this.uniqueId = iPv4;
  }
}

export interface AllowedIPsWafProps {
  allowedIPs: Array<IPv4>;
  ipScope: IPScope;
  tags?: Array<cdk.CfnTag>;
  webACLVisibilityConfig?: waf.CfnWebACL.VisibilityConfigProperty;
  ruleVisibilityConfig?: waf.CfnWebACL.VisibilityConfigProperty;
  ipSetName?: string;
  ruleName?: string;
  webACLName?: string;
}

export class AllowedIPsWaf extends cdk.Construct {
  public readonly webACLId: string;

  constructor(
    scope: cdk.Construct,
    id: string,
    props: AllowedIPsWafProps
  ) {
    super(scope, id);

    const ipSetName = props.ipSetName ? props.ipSetName : `IPSet-${this.node.uniqueId}`;
    const ruleName = props.ruleName ? props.ruleName : `IPRule-${this.node.uniqueId}`;
    const webACLName = props.webACLName ? props.webACLName : `WebACL-${this.node.uniqueId}`;

    if (!props.webACLVisibilityConfig) {
      props.webACLVisibilityConfig = {
        cloudWatchMetricsEnabled: true,
        metricName: `${webACLName}-CW-Metric`,
        sampledRequestsEnabled: true
      };
    }

    if (!props.ruleVisibilityConfig) {
      props.ruleVisibilityConfig = {
        cloudWatchMetricsEnabled: true,
        metricName: `${ruleName}-CW-Metric`,
        sampledRequestsEnabled: true
      };
    }

    const ipSet = new waf.CfnIPSet(
      this,
      'IPSet',
      {
        scope: props.ipScope,
        ipAddressVersion: 'IPV4',
        addresses: props.allowedIPs.map(ip => ip.uniqueId),
        description:
          'IP addresses allowed to access the Amazon CloudFront distribution, ' +
          `Amazon API Gateway REST API, or an Application Load Balancer. Used by ${id}.`,
        name: ipSetName,
        tags: props.tags,
      }
    );

    const webACL = new waf.CfnWebACL(
      this,
      'WebACL',
      {
        defaultAction: {
          block: {}
        },
        scope: props.ipScope,
        visibilityConfig: props.webACLVisibilityConfig,
        description: `webACL used by ${id}.`,
        name: webACLName,
        rules: [
          {
            name: ruleName,
            action: {
              allow: {}
            },
            priority: 1,
            statement: {
              ipSetReferenceStatement: {
                arn: ipSet.attrArn
              },
            },
            visibilityConfig: props.ruleVisibilityConfig
          }
        ],
        tags: props.tags
      }
    );

    this.webACLId = webACL.attrArn;
  }
}
