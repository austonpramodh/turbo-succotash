import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Todo } from './todo.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private readonly todosRepository: Repository<Todo>,
  ) {}

  public async getAll(): Promise<Todo[]> {
    const todos = await this.todosRepository.find();

    return todos;
  }

  public async getOne(id: Todo['id']): Promise<Todo | null> {
    const Todo = await this.todosRepository.findOne({
      where: {
        id,
      },
    });

    return Todo;
  }

  public async createOne(newTodo: Pick<Todo, 'name'>): Promise<Todo> {
    const savedTodo = await this.todosRepository.save({
      name: newTodo.name,
    });

    return savedTodo;
  }

  public async updateOne(
    id: Todo['id'],
    patch: Partial<Todo>,
  ): Promise<Todo | null> {
    // TODO: can be optimized to single query

    const oldTodo = await this.getOne(id);

    if (oldTodo === null) return null;

    await this.todosRepository.update(id, {
      ...patch,
    });

    const updatedTodo = await this.getOne(id);

    if (updatedTodo === null)
      throw new Error('Logical error, shouldnt happen!!');

    return updatedTodo;
  }

  public async deleteOne(todo: Partial<Todo>): Promise<boolean> {
    const savedTodo = await this.todosRepository.findOne({
      where: {
        ...todo,
      },
    });

    if (!savedTodo) return false;

    await this.todosRepository.delete(savedTodo.id);

    return true;
  }
}
