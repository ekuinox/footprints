import { config } from 'dotenv';
import { promisify } from 'util';
import child_process from 'child_process';

const exec = promisify(child_process.exec);

config();

const destroy = async () => {

  const requireApproval = process.env['CI'] === 'true' ? 'never' : 'broadening';

  return await exec(
    `npx cdk destroy --all`,
    {
      env: process.env,
    },
  );
};

destroy();
