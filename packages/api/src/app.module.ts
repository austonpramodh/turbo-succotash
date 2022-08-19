import * as path from 'path';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { Todo } from './todos/todo.entity';
import { configValidator } from './config/config.validation';
import { LoggerModule } from './logger/logger.module';

const root = path.resolve(__dirname, '..');

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: configValidator,
    }),
    LoggerModule,
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
