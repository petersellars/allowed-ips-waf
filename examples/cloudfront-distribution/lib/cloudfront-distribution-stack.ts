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

import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import { AllowedIPsWaf, IPScope, IPv4 } from 'allowed-ips-waf';

export interface CloudFrontDistributionStackProps extends cdk.StackProps {
  allowedIPs: string[]
}

export class CloudFrontDistributionStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: CloudFrontDistributionStackProps) {
    super(scope, id, props);

    const webSiteBucket = new s3.Bucket(
      this,
      'WebSiteBucket',
      {
        publicReadAccess: false,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        websiteIndexDocument: 'index.html',
        websiteErrorDocument: 'error-404.html'
      }
    );

    const allowedIPsWaf = new AllowedIPsWaf(
      this,
      'CloudFrontDistributionWaf',
      {
        allowedIPs: props.allowedIPs.map(ip => new IPv4(ip)),
        ipScope: IPScope.CLOUDFRONT,
      },
    );

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      'CloudFrontDistributionOriginAccessIdentity',
      {
        comment: 'CloudFront origin access identity to read s3 objects.',
      }
    );

    const cloudFrontDistribution = new cloudfront.CloudFrontWebDistribution(
      this,
      'WebSiteBucketCloudFrontDistribution',
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: webSiteBucket,
              originAccessIdentity: originAccessIdentity
            },
            behaviors: [
              {
                isDefaultBehavior: true
              }
            ]
          }
        ],
        errorConfigurations: [
          {
            errorCode: 403,
            responsePagePath: '/error-403.html',
            responseCode: 403
          },
          {
            errorCode: 404,
            responsePagePath: '/error-404.html',
            responseCode: 404
          }
        ],
        webACLId: allowedIPsWaf.webACLId
      }
    );

    new s3deploy.BucketDeployment(
      this,
      'WebSiteBucketDeployment',
      {
        sources: [
          s3deploy.Source.asset('./html')
        ],
        destinationBucket: webSiteBucket,
        distribution: cloudFrontDistribution,
        retainOnDelete: false
      }
    );

    new cdk.CfnOutput(
      this,
      'WebACLId',
      {
        value: allowedIPsWaf.webACLId
      }
    );

    new cdk.CfnOutput(
      this,
      'WebSiteBucketName',
      {
        value: webSiteBucket.bucketName
      }
    );

    new cdk.CfnOutput(
      this,
      'WebSiteBucketCloudFrontDistributionId',
      {
        value: cloudFrontDistribution.distributionId
      }
    );

    new cdk.CfnOutput(
      this,
      'WebSiteBucketCloudFrontDistributionDomainName',
      {
        value: cloudFrontDistribution.domainName
      }
    );
  }
}
