import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { PrettyOptions } from 'pino-pretty';
import * as pino from 'pino';
import * as pinoLoki from 'pino-loki';

import { Environment, LogLevel } from '../config/config.schema';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const environment = configService.get<Environment>('NODE_ENV');
        const loglevel = configService.get<LogLevel>('LOG_LEVEL');
        const lokiHostname = configService.get<string>('LOKI_HOST');

        const targets: pino.TransportTargetOptions[] = [];

        // if (environment === Environment.Development)
        targets.push({
          target: 'pino-pretty',
          options: {
            colorize: true,
            levelFirst: true,
            translateTime: true,
            // messageFormat: '{level} - {pid} - url:{req.url}',
          } as PrettyOptions,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          level: loglevel!,
        });

        if (lokiHostname) {
          // eslint-disable-next-line no-console
          console.log('Loki hostname is set to: ' + lokiHostname);
          /**
           * TODO: add a shutdown hook to push the remaining logs to Loki before the process exits
           */
          targets.push({
            target: 'pino-loki',
            options: {
              host: lokiHostname,
            } as Parameters<typeof pinoLoki.default>[0],
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            level: loglevel!,
          });
        }

        return {
          pinoHttp: {
            level: loglevel,
            transport: {
              targets: targets,
            },
            autoLogging: environment !== Environment.Development,
          },
          exclude: [{ method: RequestMethod.ALL, path: 'health' }],
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class LoggerModule {}
