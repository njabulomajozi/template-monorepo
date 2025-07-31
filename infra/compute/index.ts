/**
 * Compute infrastructure - Lambda functions, APIs
 */

import { config, sharedEnv } from '../config';
import { vpc, lambdaSecurityGroup } from '../network';
import { postgres, redis } from '../database';
import { bucket } from '../storage';

// API Gateway for REST endpoints
export const api = new sst.aws.Function(`${config.stage}-api`, {
  handler: 'apps/functions/src/api.handler',
  runtime: config.compute.runtime,
  architecture: config.compute.architecture,
  timeout: config.compute.timeout,
  memory: config.compute.memory,
  vpc: {
    vpc: vpc.id,
    securityGroups: [lambdaSecurityGroup.id],
  },
  environment: {
    ...sharedEnv,
    DATABASE_URL: postgres.connectionString,
    REDIS_URL: redis.connectionString,
  },
  link: [postgres, redis, bucket],
  url: true,
});

// Background job processor
export const worker = new sst.aws.Function(`${config.stage}-worker`, {
  handler: 'apps/functions/src/worker.handler',
  runtime: config.compute.runtime,
  architecture: config.compute.architecture,
  timeout: '5 minutes',
  memory: '1024 MB',
  vpc: {
    vpc: vpc.id,
    securityGroups: [lambdaSecurityGroup.id],
  },
  environment: {
    ...sharedEnv,
    DATABASE_URL: postgres.connectionString,
    REDIS_URL: redis.connectionString,
  },
  link: [postgres, redis, bucket],
});

// Scheduled task
export const scheduler = new sst.aws.Cron(`${config.stage}-scheduler`, {
  schedule: 'rate(1 hour)',
  job: {
    handler: 'apps/functions/src/scheduler.handler',
    runtime: config.compute.runtime,
    architecture: config.compute.architecture,
    timeout: '10 minutes',
    memory: '512 MB',
    environment: {
      ...sharedEnv,
      DATABASE_URL: postgres.connectionString,
    },
    link: [postgres, bucket],
  },
});