import fs from 'fs';
import { promisify } from 'util';
import { RustLambdaTarget, rustLambdaTargets } from './targets';

const rmdir = promisify(fs.rmdir);

const cleanRustLambda = async ([directory]: RustLambdaTarget) => {
  await rmdir(`${directory}/target/cdk/release/`)
    .catch(() => '[build:clean] No existing release found.');
};

Promise.all(rustLambdaTargets.map(cleanRustLambda))
  .catch(console.error);
