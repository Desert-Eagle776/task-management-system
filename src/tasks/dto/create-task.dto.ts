import { IsInt, IsNumber, IsString, MinLength, NotEquals } from "class-validator";

const MIN_LENGTH = 2;

export class CreateTaskDto {
  @IsString()
  @MinLength(MIN_LENGTH)
  readonly name: string;

  @IsString()
  @MinLength(MIN_LENGTH)
  readonly description: string;

  @IsNumber()
  @IsInt()
  @NotEquals(0)
  readonly appointedUserId: number;

  @IsNumber()
  @IsInt()
  @NotEquals(0)
  readonly project_id: number;
}