import { IsString, MinLength } from "class-validator";

const MIN_LENGTH = 1;

export class CreateProjectDto {
  @IsString()
  @MinLength(MIN_LENGTH)
  name: string;

  @IsString()
  @MinLength(MIN_LENGTH)
  description: string;
}