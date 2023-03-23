import * as path from 'path';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { OpenTelemetryModule } from 'nestjs-otel';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { Todo } from './todos/todo.entity';
import { LoggerModule } from './logger/logger.module';
import configLoader from './config/config.loader';

const root = path.resolve(__dirname, '..');

const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
  metrics: {
    hostMetrics: true, // Includes Host Metrics
    // FIXME: https://github.com/pragmaticivan/nestjs-otel/issues/151
    // defaultMetrics: true, // Includes Default Metrics
    apiMetrics: {
      enable: true, // Includes api metrics
      timeBuckets: [], // You can change the default time buckets
      defaultAttributes: {
        // You can set default labels for api metrics
        custom: 'label',
      },
      ignoreRoutes: ['/favicon.ico'], // You can ignore specific routes (See https://docs.nestjs.com/middleware#excluding-routes for options)
      ignoreUndefinedRoutes: false, //Records metrics for all URLs, even undefined ones
    },
  },
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configLoader],
    }),
    LoggerModule,
    OpenTelemetryModuleConfig,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: `${root}/db.sqlite`,
      // database: ':memory:',
      entities: [Todo],
      synchronize: true,
      logging: false,
    }),
    TodosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
