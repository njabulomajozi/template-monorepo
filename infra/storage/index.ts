/**
 * Storage infrastructure - S3 buckets, file storage
 */

import { config } from '../config';

// Main storage bucket
export const bucket = new sst.aws.Bucket(`${config.stage}-storage`, {
  cors: [
    {
      allowedHeaders: ['*'],
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
      allowedOrigins: ['*'],
      maxAge: 3000,
    },
  ],
  transform: {
    bucket: {
      versioning: {
        enabled: config.isProd,
      },
      serverSideEncryptionConfiguration: {
        rule: {
          applyServerSideEncryptionByDefault: {
            sseAlgorithm: 'AES256',
          },
        },
      },
    },
  },
});

// Assets bucket for static files
export const assetsBucket = new sst.aws.Bucket(`${config.stage}-assets`, {
  public: true,
  transform: {
    bucket: {
      website: {
        indexDocument: 'index.html',
        errorDocument: 'error.html',
      },
    },
  },
});