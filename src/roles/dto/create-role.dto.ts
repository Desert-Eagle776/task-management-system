import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

const MIN_LENGTH = 1;

export class CreateRoleDto {
  @ApiProperty({
    type: String,
    description: 'Name of the role.',
    example: 'Admin',
  })
  @IsString()
  @MinLength(MIN_LENGTH)
  name: string;

  @ApiProperty({
    type: String,
    description: 'Description of the role.',
    example: 'This is a role description',
  })
  @IsString()
  @MinLength(MIN_LENGTH)
  description: string;
}