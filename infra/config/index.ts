/**
 * Configuration and environment variables
 */

// Environment-specific configuration
export const config = {
  stage: $app.stage,
  isDev: $app.stage === 'dev',
  isProd: $app.stage === 'production',
  
  // Database configuration
  database: {
    name: `${$app.name}-${$app.stage}`,
    engine: 'postgres15.7',
  },
  
  // Storage configuration
  storage: {
    bucketName: `${$app.name}-${$app.stage}-storage`,
  },
  
  // Compute configuration
  compute: {
    runtime: 'nodejs20.x' as const,
    architecture: 'arm64' as const,
    timeout: '30 seconds',
    memory: '512 MB',
  },
} as const;

// Shared environment variables
export const sharedEnv = {
  NODE_ENV: config.isProd ? 'production' : 'development',
  STAGE: config.stage,
  APP_NAME: $app.name,
} as const;