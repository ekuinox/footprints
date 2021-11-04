import * as cdk from "@aws-cdk/core";
import { LambdaStack } from "./lib/lambda-stack";
import * as pkg from "../package.json";
import { CognitoStack } from "./lib/cognito";

const { BENCHMARK_SUFFIX } = process.env;
const STACK_NAME = BENCHMARK_SUFFIX ? `${pkg.name}-${BENCHMARK_SUFFIX}` : pkg.name;

export default class Stack {
  public cognitoStack: CognitoStack;
  public lambdaStack: LambdaStack;

  constructor(app: cdk.App) {
    this.lambdaStack = new LambdaStack(app, `${STACK_NAME}-lambda`, {});
    this.cognitoStack = new CognitoStack(app, `${STACK_NAME}-cognito`, {});
  }
}

const app = new cdk.App();
new Stack(app);
