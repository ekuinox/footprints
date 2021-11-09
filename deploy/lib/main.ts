import { Stack, App } from "@aws-cdk/core";
import { createFunction } from "./lambda";
import { createFrontend } from "./frontend";
import { createAuthentications, defaultAuthenticationProps } from "./authentication";

const { CDK_LOCAL } = process.env;

interface Props {
  projectRootDirectory: string;
};

const functionNames = [
  'sample-lambda-func',
];

export class MainStack extends Stack {
  constructor(scope: App, id: string, props: Props) {
    super(scope, id);

    const isLocal = CDK_LOCAL === 'true';
    functionNames.forEach(
      (name) => createFunction(this, name, isLocal)
    );
    const [_bucket, cloudfrontDistribution] = createFrontend(this, props.projectRootDirectory);
    const { callbackUrl: _, ...defaultAuthenticationProps_ } = defaultAuthenticationProps;
    createAuthentications(this, {
      callbackUrl: `https://${cloudfrontDistribution.distributionDomainName}`,
      ...defaultAuthenticationProps_,
    });
  }
};
