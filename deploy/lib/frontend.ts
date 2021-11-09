import path from 'path';
import { Stack } from '@aws-cdk/core';
import { Bucket } from '@aws-cdk/aws-s3';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import { CloudFrontWebDistribution, OriginAccessIdentity, PriceClass } from '@aws-cdk/aws-cloudfront';
import { Effect, PolicyStatement } from '@aws-cdk/aws-iam';

const frontendCodeDirectory = 'footprints-web/.next/server/pages';

export const createFrontend = (
  stack: Stack,
  projectRootDirectory: string
) => {
  const target = path.join(projectRootDirectory, frontendCodeDirectory);

  const bucket = new Bucket(stack, 'Bucket');
  const identity = new OriginAccessIdentity(stack, 'OriginAccessIdentity');
  const statement = new PolicyStatement({
    actions: ['s3:GetObject'],
    effect: Effect.ALLOW,
    principals: [
      identity.grantPrincipal,
    ],
    resources: [
      `${bucket.bucketArn}/*`,
    ],
  });
  bucket.addToResourcePolicy(statement);

  const distribution = new CloudFrontWebDistribution(stack, 'CloudFrontWebDistrobution', {
    errorConfigurations: [
      {
        errorCachingMinTtl: 300,
        errorCode: 403,
        responseCode: 200,
        responsePagePath: '/index.html',
      },
      {
        errorCachingMinTtl: 300,
        errorCode: 404,
        responseCode: 404,
        responsePagePath: '/404.html',
      },
      {
        errorCachingMinTtl: 300,
        errorCode: 500,
        responseCode: 500,
        responsePagePath: '/500.html',
      },
    ],
    originConfigs: [
      {
        s3OriginSource: {
          s3BucketSource: bucket,
          originAccessIdentity: identity,
        },
        behaviors: [
          {
            isDefaultBehavior: true,
          },
        ],
      },
    ],
    priceClass: PriceClass.PRICE_CLASS_ALL,
  });

  const deployment = new BucketDeployment(stack, 'BucketDeployment', {
    sources: [
      Source.asset(target),
    ],
    distribution,
    destinationBucket: bucket,
    distributionPaths: [
      '/*',
    ],
  });
};
