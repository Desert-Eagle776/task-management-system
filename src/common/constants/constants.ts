import { ApiProperty } from '@nestjs/swagger';

export enum API_RESPONSE_MESSAGE {
  SUCCESS = 'Success!',
}

export class Response<T> {
  @ApiProperty({
    type: String,
    description: 'A message describing the outcome of the request.',
    example: 'Request completed successfully',
  })
  msg: string;

  @ApiProperty({
    description:
      'The data returned in response to the request, containing the result.',
  })
  data: T;
}

export enum FamilyRoles {
  User = 'user',
  Admin = 'admin',
  SuperAdmin = 'superadmin',
}

export enum StatusType {
  ACTIVE = 'Active',
  INACTIVE = 'InActive',
}
