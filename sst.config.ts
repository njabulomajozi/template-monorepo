/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "repo",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "us-east-1",
        },
      },
    };
  },
  async run() {
    await import("./infra/secrets");
    await import("./infra/network");
    await import("./infra/database/index");
    await import("./infra/functions");
    await import("./infra/workflows");
    await import("./infra/web");
  },
});