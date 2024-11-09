import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateNotificationDto {
  @ApiProperty({
    type: String,
    description: 'Type of the device receiving the notification.',
    example: 'IOS',
  })
  @IsString()
  @IsNotEmpty()
  deviceType: string;
}
