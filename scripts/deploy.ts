import { config } from 'dotenv';
import { promisify } from 'util';
import child_process from 'child_process';

const exec = promisify(child_process.exec);

config();

const deploy = async () => {

  const requireApproval = process.env['CI'] === 'true' ? 'never' : 'broadening';

  return await exec(
    `npx cdk deploy --require-approval ${requireApproval} '*'`,
    {
      env: process.env,
    },
  );
};

deploy();
