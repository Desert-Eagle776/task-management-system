import { IsString, MinLength } from "class-validator";

const MIN_LENGTH = 2;

export class CreateTaskStatusDto {
  @IsString()
  @MinLength(MIN_LENGTH)
  readonly name: string;

  @IsString()
  @MinLength(MIN_LENGTH)
  readonly description: string;
}