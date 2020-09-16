# Allowed IPs WAF

An AWS CDK Construct for defining AWS WAFs that allow a specified IP range access to an Amazon CloudFront distribution, an Amazon API Gateway REST API, or an Application Load Balancer.

## Getting Started
Find which version of the AWS CDK is installed.
```sh
$ cdk --version
```

Install the allowed-ips-waf package using npm.
```sh
$ npm install -E allowed-ips-waf@<cdk version>
```

**Example** 
   
Using the Construct to define IPs allowed to access an Amazon CloudFront distribution for an S3 based web-site.
```typescript
import { App, Stack, RemovalPolicy } from '@aws-cdk/core';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import { AllowedIPsWaf, IPScope, IPv4 } from 'allowed-ips-waf';

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

const webSiteBucket = new s3.Bucket(
  stack,
  'webSiteBucket',
  {
    publicReadAccess: false,
    removalPolicy: RemovalPolicy.DESTROY,
    websiteIndexDocument: 'index.html',
    websiteErrorDocument: 'error-404.html'
  }
);

const originAccessIdentity = new cloudfront.OriginAccessIdentity(
  stack,
  'originAccessIdentity',
  {
    comment: 'CloudFront origin access identity to read s3 objects in a specific bucket.'
  }
);

const cloudFrontDistribution = new cloudfront.CloudFrontWebDistribution(
  stack,
  'cloudFrontDistribution',
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
  stack,
  'bucketDeployment',
  {
    /*
    Assuming there is an 'html' folder at the root of the CDK project
    with index.html, error-403.html, and error-404.html files.
    */
    sources: [
      s3deploy.Source.asset('./html')
    ],
    destinationBucket: webSiteBucket,
    distribution: cloudFrontDistribution,
    retainOnDelete: false
  }
);
```

## Useful commands
 * `npm install`     install package dependencies
 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
