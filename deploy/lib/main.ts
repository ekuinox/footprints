import { ApiDocument, createApi, HttpMethod } from './api';
import { Stack, App } from "@aws-cdk/core";
import { createFunction } from "./lambda";
import { createFrontend } from "./frontend";
import { createAuthentications, defaultAuthenticationProps } from "./authentication";

const { CDK_LOCAL } = process.env;

interface Props {
  projectRootDirectory: string;
  schema: ApiDocument;
};

const handlers: ReadonlyArray<readonly [name: string, path: string, method: HttpMethod]> = [
  ['get_status', '/status', 'get'],
];

export class MainStack extends Stack {
  constructor(
    scope: App,
    id: string,
    {
      projectRootDirectory,
      schema,
    }: Props
  ) {
    super(scope, id);

    const isLocal = CDK_LOCAL === 'true';
    const handlers_ = handlers.map(([name, ...rest]) => [name, ...rest, ...createFunction(this, name, projectRootDirectory, isLocal)] as const);
    const api = createApi(this, schema, handlers_);
    
    const [_bucket, cloudfrontDistribution] = createFrontend(this, projectRootDirectory);
    const { callbackUrl: _, ...defaultAuthenticationProps_ } = defaultAuthenticationProps;
    createAuthentications(this, {
      callbackUrl: `https://${cloudfrontDistribution.distributionDomainName}`,
      ...defaultAuthenticationProps_,
    });
  }
};
