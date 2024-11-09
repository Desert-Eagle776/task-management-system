import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

const MIN_LENGTH = 2;

export class CreateTaskStatusDto {
  @ApiProperty({
    type: String,
    description: 'Name of the task status.',
    example: 'Created',
  })
  @IsString()
  @MinLength(MIN_LENGTH)
  readonly name: string;

  @ApiProperty({
    type: String,
    description: 'Description of the task status.',
    example: 'Task Status Description',
  })
  @IsString()
  @MinLength(MIN_LENGTH)
  readonly description: string;
}