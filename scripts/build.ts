import fs from 'fs';
import stream from 'stream';
import { promisify } from 'util';
import { createGzip } from 'zlib';
import child_process from 'child_process';
import { RustLambdaTarget, rustLambdaTargets } from './targets';

const mkdir = promisify(fs.mkdir);
const exec = promisify(child_process.exec);
const pipeline = promisify(stream.pipeline);


const buildRustLambda = async ([directory, name]: RustLambdaTarget) => {
  await exec(
    'cross build --release --target x86_64-unknown-linux-musl',
    { cwd: directory }
  ).then(({ stdout, stderr }) => {
    // stderr に Finished が含まれるのようわからん 助けてくれ～
    console.log({ stdout, stderr });
  });

  await mkdir(`${directory}/target/cdk/release/`, { recursive: true });

  const source = fs.createReadStream(
    `${directory}/target/x86_64-unknown-linux-musl/release/${name}`
  );

  const dest = fs.createWriteStream(
    `${directory}/target/cdk/release/${name}.zip`
  );

  const gzip = createGzip();
  return await pipeline(source, gzip, dest);

};

Promise.all(rustLambdaTargets.map(buildRustLambda))
  .catch(console.error);
