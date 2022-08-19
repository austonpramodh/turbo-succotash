import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { PrettyOptions } from 'pino-pretty';

import { Environment, LogLevel } from '../config/config.schema';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const environment = configService.get<Environment>('NODE_ENV');
        const loglevel = configService.get<LogLevel>('LOG_LEVEL');

        return {
          pinoHttp: {
            level: loglevel,
            transport:
              environment === Environment.Development
                ? {
                    target: 'pino-pretty',
                    options: {
                      colorize: true,
                      levelFirst: true,
                      translateTime: true,
                      // messageFormat: '{level} - {pid} - url:{req.url}',
                    } as PrettyOptions,
                  }
                : undefined,

            formatters: {
              level: (label): Record<string, unknown> => ({ level: label }),
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
