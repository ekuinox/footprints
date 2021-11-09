import * as cdk from "@aws-cdk/core";
import * as pkg from "../package.json";
import { Footprints } from "./lib/footprints";

const { BENCHMARK_SUFFIX } = process.env;
const STACK_NAME = BENCHMARK_SUFFIX ? `${pkg.name}-${BENCHMARK_SUFFIX}` : pkg.name;

export default class Stack {
  public footprints: Footprints;

  constructor(app: cdk.App) {
    this.footprints = new Footprints(app, `${STACK_NAME}-footprints`, {});
  }
}

const app = new cdk.App();
new Stack(app);
