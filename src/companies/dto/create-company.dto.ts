import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

const MIN_LENGTH = 1;
const MAX_LENGTH = 100;

export class CreateCompanyDto {
  @IsString()
  @MinLength(MIN_LENGTH)
  @MaxLength(MAX_LENGTH)
  readonly name: string;

  @IsString()
  @IsEmail()
  @MinLength(MIN_LENGTH)
  @MaxLength(MAX_LENGTH)
  readonly email: string;
}