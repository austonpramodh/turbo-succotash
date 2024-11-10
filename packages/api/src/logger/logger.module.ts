import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { Module } from '@nestjs/common';

import { logger } from './logger';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      useFactory: async () => {
        return {
          pinoHttp: { logger: logger() },
        };
      },
      // exclude: [{ method: RequestMethod.ALL, path: 'health' }],
    }),
  ],
  controllers: [],
  providers: [],
})
export class LoggerModule {}
