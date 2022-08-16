import { PartialType } from '@nestjs/swagger';

import { CreateTodoDto } from './createTodo.dto';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {}
