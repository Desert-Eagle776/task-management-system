import { IsInt, IsNumber, NotEquals } from "class-validator";

export class CreateRoleDto {
  @IsNumber()
  @IsInt()
  @NotEquals(0)
  userId: number;

  @IsNumber()
  @IsInt()
  @NotEquals(0)
  roleId: number;
}