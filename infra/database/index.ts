/**
 * Database infrastructure - PostgreSQL, Redis, etc.
 */

import { config } from '../config';
import { vpc, dbSecurityGroup } from '../network';

// PostgreSQL database
export const postgres = new sst.aws.Postgres(`${config.stage}-postgres`, {
  vpc,
  engine: config.database.engine,
  scaling: {
    min: config.isProd ? '0.5 ACU' : '0.5 ACU',
    max: config.isProd ? '16 ACU' : '2 ACU',
  },
  transform: {
    cluster: {
      databaseName: config.database.name,
      masterUsername: 'postgres',
      vpcSecurityGroupIds: [dbSecurityGroup.id],
      skipFinalSnapshot: !config.isProd,
      deletionProtection: config.isProd,
    },
  },
});

// Redis for caching (optional)
export const redis = new sst.aws.Redis(`${config.stage}-redis`, {
  vpc,
  engine: 'redis7.x',
  nodeType: config.isProd ? 'cache.t4g.micro' : 'cache.t4g.micro',
});