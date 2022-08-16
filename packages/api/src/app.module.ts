import * as path from 'path';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { Todo } from './todos/todo.entity';
import { TodosService } from './todos/todos.service';
import { TodosController } from './todos/todos.controller';

const root = path.resolve(__dirname, '..');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: `${root}/db.sqlite`,
      entities: [Todo],
      synchronize: true,
      logging: true,
    }),
    TodosModule,
  ],
  controllers: [AppController, TodosController],
  providers: [AppService, TodosService],
})
export class AppModule {}
