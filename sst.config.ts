/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'monorepo-template',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage || ''),
      home: 'aws',
      providers: {
        aws: {
          region: 'us-east-1',
          profile: input?.stage === 'production' ? 'production' : 'default',
        },
      },
    };
  },
  async run() {
    // Infrastructure layers - order matters for dependencies
    await import('./infra/config');
    await import('./infra/network/index');
    await import('./infra/database/index');
    await import('./infra/storage/index');
    await import('./infra/compute/index');
    await import('./infra/apps/index');
  },
});