import { Bucket } from "@aws-cdk/aws-s3";
import { Aspects, Duration, Stack, Tag } from "@aws-cdk/core";
import { Code, Function, Runtime, Tracing } from "@aws-cdk/aws-lambda";

export const createFunction = (
  stack: Stack,
  name: string,
  isLocal: boolean,
) => {
  const bootstrapLocation = `${__dirname}/../../${name}/target/cdk/release/bootstrap.zip`;

  const entryId = "main";
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
};
