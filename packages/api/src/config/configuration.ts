import { readFileSync } from 'fs';
import { join } from 'path';

import * as yaml from 'js-yaml';

const YAML_CONFIG_FILENAME = 'config.yaml';

export default (): Record<string, unknown> => {
  const config = yaml.load(
    readFileSync(join(__dirname, '../../../../', YAML_CONFIG_FILENAME), 'utf8'),
  ) as Record<string, unknown>;

  return config.api as Record<string, unknown>;
};
