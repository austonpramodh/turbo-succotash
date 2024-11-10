import * as path from 'path';

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenTelemetryModule } from 'nestjs-otel';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { Todo } from './todos/todo.entity';
import { TodosService } from './todos/todos.service';
import { TodosController } from './todos/todos.controller';
import { CommonModule } from './common/common.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { LoggerModule } from './logger/logger.module';

const root = path.resolve(__dirname, '..');

const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
  metrics: {
    hostMetrics: true,
    apiMetrics: {
      enable: true,
    },
  },
});

@Module({
  imports: [
    LoggerModule,
    OpenTelemetryModuleConfig,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: `${root}/db.sqlite`,
      entities: [Todo],
      synchronize: true,
      logging: true,
    }),
    CommonModule,
    TodosModule,
  ],
  controllers: [AppController, TodosController],
  providers: [AppService, TodosService],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
