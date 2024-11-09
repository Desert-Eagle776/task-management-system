import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

const MIN_LENGTH = 1;

export class CreateProjectDto {
  @ApiProperty({
    type: String,
    description: 'The name of the project.',
    example: 'Website Redesign Project',
  })
  @IsString()
  @MinLength(MIN_LENGTH)
  name: string;

  @ApiProperty({
    type: String,
    description: 'The description of the project.',
    example: 'This is a project description',
  })
  @IsString()
  @MinLength(MIN_LENGTH)
  description: string;
}