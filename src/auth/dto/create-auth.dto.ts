import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class CreateAuthDto {
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  readonly fullname: string;

  @IsString()
  @IsEmail()
  @MinLength(1)
  @MaxLength(100)
  readonly email: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  readonly password: string;
}
