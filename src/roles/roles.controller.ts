import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';
import { Roles } from './roles.decorator';
import { FamilyRoles, RolesGuard } from './roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
  ) { }

  @Roles(FamilyRoles.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('add')
  createRole(@Body() dto: CreateRoleDto) {
    return this.rolesService.addRole(dto);
  }

  @Roles(FamilyRoles.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  oneRole(@Param('id') id: string) {
    return this.rolesService.getOneRole(id);
  }

  @Roles(FamilyRoles.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  allRoles() {
    return this.rolesService.getAllRoles();
  }

  @Roles(FamilyRoles.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  removeRole(@Param('id') id: string) {
    return this.rolesService.deleteRole(id);
  }
}
