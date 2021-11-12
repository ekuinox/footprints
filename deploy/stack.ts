import path from "path";
import { App } from "@aws-cdk/core";
import * as pkg from "../package.json";
import { MainStack } from "./lib/main";
import $RefParser from '@apidevtools/json-schema-ref-parser';
$RefParser.dereference = $RefParser.dereference.bind($RefParser);
$RefParser.resolve = $RefParser.resolve.bind($RefParser);
import { dereference } from '@apidevtools/swagger-parser';

const { BENCHMARK_SUFFIX } = process.env;
const STACK_NAME = BENCHMARK_SUFFIX ? `${pkg.name}-${BENCHMARK_SUFFIX}` : pkg.name;
const projectRootDirectory = process.cwd();
const openApiSchema = path.join(projectRootDirectory, 'schemas/openapi.yml');

const createStacks = async () => {
  const schema = await dereference(openApiSchema);
  const app = new App();
  const mainStack = new MainStack(
    app,
    `${STACK_NAME}-main`,
    {
      schema,
      projectRootDirectory,
    }
  );

};

createStacks();
