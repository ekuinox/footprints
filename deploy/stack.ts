import * as cdk from "@aws-cdk/core";
import * as pkg from "../package.json";
import { MainStack } from "./lib/main";

const { BENCHMARK_SUFFIX } = process.env;
const STACK_NAME = BENCHMARK_SUFFIX ? `${pkg.name}-${BENCHMARK_SUFFIX}` : pkg.name;

export default class Stack {
  public mainStack: MainStack;

  constructor(app: cdk.App) {
    this.mainStack = new MainStack(app, `${STACK_NAME}-main`, {});
  }
}

const app = new cdk.App();
new Stack(app);
