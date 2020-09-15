# CloudFront Distribution WAF

A WAF that allows a specified IP range access to an Amazon CloudFront distribution.  

## Deploy the Example to an AWS Account

Install the AWS CDK
```
$ npm install -g aws-cdk
```

Bootstrap the AWS CDK deployment environment
```
$ cdk bootstrap
```

**In the example's root directory**

Configure IPv4 CIDR range / individual addresses in the "allowed-ips.json" file at the root of this project.
For example:
```json
[
  "35.180.0.0/16",
  "52.93.178.234/32",
  "52.94.76.0/22"
]
```

Install the project's dependencies
```
$ npm install
```

Then, you can deploy the CloudFormation stack by running this command
```
$ cdk deploy --outputs-file outputs.json --require-approval never
```
This will write the stacks output to an "outputs.json" file and deploy the stack without pausing to ask for an approval.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
