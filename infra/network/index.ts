/**
 * Network infrastructure - VPC, subnets, security groups
 */

import { config } from '../config';

// VPC for all resources
export const vpc = new sst.aws.Vpc(`${config.stage}-vpc`, {
  az: 2, // Use 2 availability zones for high availability
});

// Security group for database access
export const dbSecurityGroup = new sst.aws.SecurityGroup(`${config.stage}-db-sg`, {
  vpc: vpc.id,
  ingress: [
    {
      protocol: 'tcp',
      fromPort: 5432,
      toPort: 5432,
      cidrBlocks: [vpc.nodes.vpc.cidrBlock],
    },
  ],
  egress: [
    {
      protocol: '-1',
      fromPort: 0,
      toPort: 0,
      cidrBlocks: ['0.0.0.0/0'],
    },
  ],
});

// Security group for Lambda functions
export const lambdaSecurityGroup = new sst.aws.SecurityGroup(`${config.stage}-lambda-sg`, {
  vpc: vpc.id,
  egress: [
    {
      protocol: '-1',
      fromPort: 0,
      toPort: 0,
      cidrBlocks: ['0.0.0.0/0'],
    },
  ],
});