import { cleanEnv, str } from 'envalid';
import { execSync } from 'child_process';

export default () =>
  cleanEnv(process.env, {
    YARN_CACHE_FOLDER: str({
      default: JSON.parse(execSync('yarn config cacheFolder --json')).effective,
    }),
  });
