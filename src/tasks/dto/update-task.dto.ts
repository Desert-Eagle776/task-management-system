import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  NotEquals,
} from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({
    type: String,
    description: 'Name of the task.',
    example: 'Task Name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Description of the task.',
    example: 'This is a task description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: Number,
    description: 'The ID of the user assigned to this task.',
    example: 123,
  })
  @IsNumber()
  @IsInt()
  @NotEquals(0)
  @IsNotEmpty()
  appointedUserId: number;
}
