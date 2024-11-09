import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginAuthDto {
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
