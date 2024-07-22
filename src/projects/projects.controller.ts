import { Body, Controller, Delete, Get, Headers, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { AuthService } from 'src/auth/auth.service';
import { IUserDataInToken } from 'src/users/interfaces/user-payload';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FamilyRoles, RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { ProjectEntity } from './entities/project.entity';
import { IDeleteProject } from './interfaces/delete-project.interface';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly authService: AuthService,
    private readonly projectsService: ProjectsService,
  ) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(FamilyRoles.Admin)
  @Post('add')
  createProject(@Body() dto: CreateProjectDto, @Headers() headers: string): Promise<ProjectEntity> {
    const token: string = headers["authorization"].split(' ')[1];
    const getDataFromToken: IUserDataInToken = this.authService.getUserDataFromToken(token);

    return this.projectsService.createProject(dto, getDataFromToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  oneProject(@Param('id', ParseIntPipe) id: number, @Headers() headers: string): Promise<ProjectEntity> {
    const token: string = headers["authorization"].split(' ')[1];
    const getDataFromToken: IUserDataInToken = this.authService.getUserDataFromToken(token);

    return this.projectsService.getOneProject(id, getDataFromToken);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(FamilyRoles.SuperAdmin)
  @Get('all/:page')
  allProjects(@Param('page', ParseIntPipe) page: number,): Promise<ProjectEntity[]> {
    return this.projectsService.getAllProjects(page);
  }

  @Put(':id')
  updateProject(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateProjectDto): Promise<ProjectEntity> {
    return this.projectsService.updateProject(id, dto);
  }

  @Delete(':id')
  deleteProject(@Param('id', ParseIntPipe) id: number): Promise<IDeleteProject> {
    return this.projectsService.deleteProject(id);
  }
}
