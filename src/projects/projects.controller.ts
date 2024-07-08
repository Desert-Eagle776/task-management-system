import { Body, Controller, Get, Headers, Param, Post, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { AuthService } from 'src/auth/auth.service';
import { ITokenData } from 'src/interfaces';
import { IUserDataInToken } from 'src/users/interfaces/user-payload';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FamilyRoles, RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly authService: AuthService,
    private readonly projectsService: ProjectsService
  ) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(FamilyRoles.Admin)
  @Post('add')
  createProject(@Body() dto: CreateProjectDto, @Headers() headers: string) {
    const token: string = headers["authorization"].split(' ')[1];
    const getDataFromToken: IUserDataInToken = this.authService.getUserDataFromToken(token);

    return this.projectsService.createProject(dto, getDataFromToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  oneProject(@Param('id') id: string, @Headers() headers: string) {
    const token: string = headers["authorization"].split(' ')[1];
    const getDataFromToken: IUserDataInToken = this.authService.getUserDataFromToken(token);

    return this.projectsService.getOneProject(id, getDataFromToken);
  }
}
