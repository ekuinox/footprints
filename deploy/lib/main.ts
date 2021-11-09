import { Stack, App } from "@aws-cdk/core";
import { createFunction } from "./lambda";
import { createAuthentications } from "./authentication";
import { createFrontend } from "./frontend";

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
    createAuthentications(this);
    createFrontend(this, props.projectRootDirectory);
  }
};
