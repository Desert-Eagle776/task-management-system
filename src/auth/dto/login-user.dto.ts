import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    type: String,
    description: 'The email address of the user.',
    example: 'johndoe@example.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description: 'The password for the user account.',
    example: 'securePassword123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
