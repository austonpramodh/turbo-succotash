import { ApiProperty } from '@nestjs/swagger';

// import { Todo } from '../todo.entity';

export class TodoDto {
  @ApiProperty({
    description: 'ID',
  })
  public id: string;

  @ApiProperty({
    description: 'name for the todo',
  })
  public name: string;

  @ApiProperty({
    description: 'Status of the todo',
  })
  public isDone: boolean;

  @ApiProperty({
    description: 'Updated At',
  })
  public updatedAt: Date;

  @ApiProperty({
    description: 'Deleted At',
  })
  public deletedAt?: Date | undefined;

  @ApiProperty({
    description: 'Created At',
  })
  public createdAt: Date;
}
