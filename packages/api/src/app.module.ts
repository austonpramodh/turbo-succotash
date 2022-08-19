import * as path from 'path';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { Todo } from './todos/todo.entity';
import { TodosService } from './todos/todos.service';
import { TodosController } from './todos/todos.controller';
import configuration from './config/configuration';
import { configValidator } from './config/config.validation';

const root = path.resolve(__dirname, '..');

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validate: configValidator,
    }),
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
  controllers: [AppController, TodosController],
  providers: [AppService, TodosService],
})
export class AppModule {}
