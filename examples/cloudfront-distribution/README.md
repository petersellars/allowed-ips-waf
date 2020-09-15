# CloudFront Distribution WAF Sample Stack

A WAF that allows a specified IP range access to an Amazon CloudFront distribution.  

## Deploy the Sample to an AWS Account

Install the AWS CDK.
```
$ npm install -g aws-cdk
```

Bootstrap the AWS account to enable CDK asset deployment.
```
$ cdk bootstrap
```

**In the sample's root directory**

Configure IPv4 CIDR ranges and/or individual addresses allowed to access the distribution using the "allowed-ips.json" file at the root of this project.  

**Example**
```json
[
  "35.180.0.0/16",
  "52.93.178.234/32",
  "52.94.76.0/22"
]
```

Install the project's dependencies using npm.
```
$ npm install
```

Deploy the sample CloudFormation stack to an AWS account.
```
$ cdk deploy --outputs-file outputs.json --require-approval never
```
This will write the stacks output to an "outputs.json" file and deploy the stack without pausing to ask for approvals.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
