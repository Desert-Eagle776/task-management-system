import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AssignRoleDto } from './dto/assign-role.dto';
import { FamilyRoles } from 'src/common';

@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Internal server error',
})
@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Roles(FamilyRoles.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('add')
  @ApiOperation({
    summary: 'Create a new role',
    description: 'This endpoint allows to create a new role in the system',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The role has been successfully created',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A conflict occurred',
  })
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.addRole(createRoleDto);
  }

  @Roles(FamilyRoles.Admin, FamilyRoles.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('assign')
  @ApiOperation({
    summary: 'Assign a role to a user',
    description:
      'This endpoint allows assigning an existing role to a specified user in the system',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The role has been successfully assigned to the user',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The specified resource could not be found',
  })
  assignRole(@Body() assignRoleDto: AssignRoleDto) {
    return this.rolesService.assignRole(assignRoleDto);
  }

  @Roles(FamilyRoles.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Find a role by ID',
    description:
      'This endpoint retrieves the details of a role based on the provided role ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The role has been successfully retrieved',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The specified resource could not be found',
  })
  findRoleById(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.getOneRole(id);
  }

  @Roles(FamilyRoles.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @ApiOperation({
    summary: 'Retrieve all roles',
    description:
      'This endpoint retrieves a list of all roles available in the system',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All roles have been successfully retrieved',
  })
  allRoles() {
    return this.rolesService.getAllRoles();
  }

  @Roles(FamilyRoles.SuperAdmin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @ApiOperation({
    summary: 'Remove a role by ID',
    description:
      'This endpoint deletes a role from the system based on the provided role ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The role has been successfully removed',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The specified resource could not be found',
  })
  removeRole(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.deleteRole(id);
  }
}
