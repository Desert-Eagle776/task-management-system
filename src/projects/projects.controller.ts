import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { AuthService } from 'src/auth/auth.service';
import { IUserDataInToken } from 'src/common/constants/users.contants';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FamilyRoles } from 'src/common';

@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Internal server error',
})
@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly authService: AuthService,
    private readonly projectsService: ProjectsService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(FamilyRoles.Admin)
  @Post()
  @ApiOperation({
    summary: 'Create a new project',
    description:
      'This endpoint allows users to create a new project in the company',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The project has been successfully created',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The specified resource could not be found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A conflict occurred',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied',
  })
  createProject(@Body() dto: CreateProjectDto, @Headers() headers: string) {
    const token: string = headers['authorization'].split(' ')[1];
    const getDataFromToken: IUserDataInToken =
      this.authService.getUserDataFromToken(token);

    return this.projectsService.createProject(dto, getDataFromToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Find a project by ID',
    description:
      'This endpoint retrieves the details of a project based on the provided project ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The project has been successfully retrieved',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The specified resource could not be found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied',
  })
  findProjectById(
    @Param('id', ParseIntPipe) id: number,
    @Headers() headers: string,
  ) {
    const token: string = headers['authorization'].split(' ')[1];
    const getDataFromToken: IUserDataInToken =
      this.authService.getUserDataFromToken(token);

    return this.projectsService.getOneProject(id, getDataFromToken);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(FamilyRoles.SuperAdmin)
  @Get('all/:page')
  @ApiOperation({
    summary: 'Retrieve all projects',
    description:
      'This endpoint retrieves a paginated list of all projects in the system',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The list of projects has been successfully retrieved',
  })
  allProjects(@Param('page', ParseIntPipe) page: number) {
    return this.projectsService.getAllProjects(page);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(FamilyRoles.Admin)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update an existing project',
    description:
      'This endpoint allows users to update the details of an existing project by specifying the project ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The project has been successfully updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The specified resource could not be found',
  })
  updateProject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateProjectDto,
  ) {
    return this.projectsService.updateProject(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(FamilyRoles.Admin)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a project by ID',
    description:
      'This endpoint allows the deletion of a project based on the provided project ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The project has been successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The specified resource could not be found',
  })
  deleteProject(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.deleteProject(id);
  }
}
