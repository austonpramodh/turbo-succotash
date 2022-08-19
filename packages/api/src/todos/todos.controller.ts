import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { TodoDto } from './dtos/todo.dto';
import { ApiResponse, CommonResponseType } from './dtos/Response.dto';
import { CreateTodoDto } from './dtos/createTodo.dto';
import { UpdateTodoDto } from './dtos/updateTodo.dto';
import { TodosService } from './todos.service';

@ApiTags('todos')
@Controller({
  path: 'todos',
  version: '1',
})
export class TodosController {
  constructor(
    private readonly todosService: TodosService,
    private readonly configService: ConfigService,
  ) {}

  @ApiResponse({
    model: TodoDto,
    type: 'array',
    description: 'The todo records!',
  })
  @Get()
  public async getAll(): Promise<CommonResponseType<TodoDto[]>> {
    const dbUser = this.configService.get<string>('dbUser');

    console.log(dbUser);
    const todos = await this.todosService.getAll();

    return {
      success: true,
      data: todos,
      meta: undefined,
      message: 'Todos fetched successfully!',
    };
  }

  @ApiResponse({
    model: TodoDto,
    type: 'object',
    description: 'Todo created!',
  })
  @Post()
  public async create(
    @Body() createTodoDto: CreateTodoDto,
  ): Promise<CommonResponseType<TodoDto>> {
    const savedTodo = await this.todosService.createOne(createTodoDto);

    return {
      success: true,
      data: savedTodo,
      meta: undefined,
      message: 'Todo created successfully!',
    };
  }

  @ApiResponse({
    model: TodoDto,
    type: 'object',
    description: 'Todo updated!',
  })
  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<CommonResponseType<TodoDto>> {
    const updatedTodo = await this.todosService.updateOne(id, updateTodoDto);

    if (updatedTodo === null) {
      throw new UnprocessableEntityException(
        'The todo with the given id not found!',
      );
    }

    return {
      success: true,
      data: updatedTodo,
      meta: undefined,
      message: 'Todo updated successfully!',
    };
  }

  @Delete('/flush')
  public async flush(): Promise<CommonResponseType> {
    await this.todosService.flush();

    return {
      success: true,
      data: undefined,
      meta: undefined,
      message: 'Todo table cleared successfully!!',
    };
  }

  @ApiResponse({
    model: TodoDto,
    type: 'array',
    description: 'Todo deleted successfully!',
  })
  @Delete('/:id')
  public async delete(@Param('id') id: string): Promise<CommonResponseType> {
    const deleteResponse = await this.todosService.deleteOne({
      id: id,
    });

    if (!deleteResponse)
      throw new HttpException(
        'Todo to be deleted not found!',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    return {
      success: true,
      data: undefined,
      meta: undefined,
      message: 'Todo deleted successfully!',
    };
  }
}
