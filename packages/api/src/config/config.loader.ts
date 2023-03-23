import { readFileSync } from 'fs';
import { join } from 'path';

import * as yaml from 'js-yaml';

import { configValidator } from './config.validation';
import { EnvironmentVariables } from './config.schema';

const YAML_CONFIG_FILENAME = '../../../../config.yaml';

const configLoader = (): EnvironmentVariables => {
  const yamlLoaded = yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
  ) as Record<'api', Record<string, unknown>>;

  const validatedConfig = configValidator(yamlLoaded.api);

  return validatedConfig;
};

export default configLoader;
