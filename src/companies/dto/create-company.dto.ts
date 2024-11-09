import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    type: String,
    description: 'The name of the company.',
    example: 'Tech Innovations Ltd.',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    description: 'The contact email for the company.',
    example: 'contact@techinnovations.com',
  })
  @IsString()
  @IsEmail()
  email: string;
}
