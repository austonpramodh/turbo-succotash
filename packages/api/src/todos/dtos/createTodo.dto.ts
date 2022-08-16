import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({
    description: 'The name of the Todo',
  })
  @IsNotEmpty()
  public readonly name: string;
}
