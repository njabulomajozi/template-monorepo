/**
 * Application infrastructure - Next.js, static sites
 */

import { config, sharedEnv } from '../config';
import { postgres, redis } from '../database';
import { bucket } from '../storage';
import { api } from '../compute';

// Next.js web application (when created)
// Uncomment when you add a Next.js app in apps/web
/*
export const web = new sst.aws.Nextjs(`${config.stage}-web`, {
  path: 'apps/web',
  environment: {
    ...sharedEnv,
    API_URL: api.url,
  },
  link: [postgres, redis, bucket],
  domain: config.isProd ? 'yourdomain.com' : undefined,
});
*/

// Static documentation site (when created)
// Uncomment when you add a docs site
/*
export const docs = new sst.aws.StaticSite(`${config.stage}-docs`, {
  path: 'apps/docs',
  build: {
    command: 'npm run build',
    output: 'dist',
  },
  domain: config.isProd ? 'docs.yourdomain.com' : undefined,
});
*/