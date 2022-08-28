import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

export enum LogLevel {
  // INFO in `pino-logger` is equal to LOG in `@nestjs/common-logger`
  INFO = 'info',
  Error = 'error',
  WARN = 'warn',
  DEBUG = 'debug',
  // TRACE in `pino-logger` is equal to VERBOSE in `@nestjs/common-logger`
  TRACE = 'trace',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  public NODE_ENV = Environment.Development;

  @IsNumber()
  public PORT: number;

  @IsEnum(LogLevel)
  public LOG_LEVEL = LogLevel.DEBUG;

  @IsOptional()
  @IsString()
  public LOKI_HOST?: string;
}
