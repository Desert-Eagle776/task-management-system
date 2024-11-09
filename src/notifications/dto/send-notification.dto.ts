import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendNotificationDto {
  @ApiProperty({
    type: String,
    description: 'The title of the notification.',
    example: 'New Message',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: String,
    description: 'The main content of the notification.',
    example: 'You have a new message waiting for you',
  })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    type: Number,
    description: 'The user ID.',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  user: number;
}
