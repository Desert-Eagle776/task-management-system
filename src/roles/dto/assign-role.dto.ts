import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, NotEquals } from "class-validator";

export class AssignRoleDto {
  @ApiProperty({
    type: Number,
    description: 'ID of the user.',
    example: 1,
  })
  @IsNumber()
  @IsInt()
  @NotEquals(0)
  userId: number;

  @ApiProperty({
    type: String,
    description: 'ID of the role',
    example: 1,
  })
  @IsNumber()
  @IsInt()
  @NotEquals(0)
  roleId: number;
}