import path from "path";
import { Bucket } from "@aws-cdk/aws-s3";
import { Aspects, Duration, Stack, Tag } from "@aws-cdk/core";
import { Code, Function, Runtime, Tracing } from "@aws-cdk/aws-lambda";

const lambdaPackageDirectoryName = 'footprints-functions';

export const createFunction = (
  stack: Stack,
  name: string,
  projectRootDirectory: string,
  isLocal: boolean,
): [Function] => {
  const bootstrapLocation = path.join(projectRootDirectory, lambdaPackageDirectoryName, `/target/cdk/release/${name}`);

  const entryId = name;
  const entryFnName = `${stack.stackName}-${entryId}`;
  const entry = new Function(stack, entryId, {
    functionName: entryFnName,
    runtime: Runtime.PROVIDED_AL2,
    handler: `${stack.stackId}`, 
    code:
      isLocal
        ? Code.fromBucket(Bucket.fromBucketName(stack, `LocalBucket`, "__local__"), bootstrapLocation)
        : Code.fromAsset(bootstrapLocation),
    memorySize: 256,
    timeout: Duration.seconds(10),
    tracing: Tracing.ACTIVE,
  });

  entry.addEnvironment("AWS_NODEJS_CONNECTION_REUSE_ENABLED", "1");

  Aspects.of(entry).add(new Tag("service-type", "API"));
  Aspects.of(entry).add(new Tag("billing", `lambda-${entryFnName}`));

  return [entry];
};
