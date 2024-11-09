import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NotificationDto {
  @ApiProperty({
    type: String,
    description: 'Type of the device receiving the notification.',
    example: 'IOS',
  })
  @IsString()
  @IsNotEmpty()
  deviceType: string;

  @ApiProperty({
    type: String,
    description: 'Token to identify the user for sending the notification.',
  })
  @IsString()
  @IsNotEmpty()
  notificationToken: string;
}
