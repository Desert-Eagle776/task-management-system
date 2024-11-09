import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  NotEquals,
} from 'class-validator';

export class CreateTaskDto {
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
  @IsOptional()
  description?: string;

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

  @ApiProperty({
    type: Number,
    description: 'The ID of the project to which this task belongs.',
    example: 123,
  })
  @IsNumber()
  @IsInt()
  @NotEquals(0)
  @IsNotEmpty()
  projectId: number;
}
