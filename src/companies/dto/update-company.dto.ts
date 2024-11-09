import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

const MIN_LENGTH = 1;
const MAX_LENGTH = 100;

export class UpdateCompanyDto {
  @ApiProperty({
    type: String,
    description: 'The name of the company.',
    example: 'Tech Innovations Ltd.',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    description: 'The contact email for the company.',
    example: 'contact@techinnovations.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
