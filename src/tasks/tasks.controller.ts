import { Body, Controller, Post, Headers, UseGuards, Get, Param, Patch, ParseIntPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTaskStatusDto } from './dto/create-task-status.dto';
import { IUserDataInToken } from 'src/users/interfaces/user-payload';
import { FamilyRoles, RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly authService: AuthService,
    private readonly tasksService: TasksService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  createTask(@Body() dto: CreateTaskDto, @Headers() headers: string) {
    const token: string = headers["authorization"].split(' ')[1];
    const getDataFromToken: IUserDataInToken = this.authService.getUserDataFromToken(token);

    return this.tasksService.createTask(dto, getDataFromToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getTaskById(@Param('id', ParseIntPipe) id: number, @Headers() headers: string) {
    const token: string = headers["authorization"].split(' ')[1];
    const getDataFromToken: IUserDataInToken = this.authService.getUserDataFromToken(token);

    return this.tasksService.viewTask(id, getDataFromToken);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/complete/:id')
  markTaskAsComplete(@Param('id', ParseIntPipe) id: number, @Headers() headers: string) {
    const token: string = headers["authorization"].split(' ')[1];
    const getDataFromToken: IUserDataInToken = this.authService.getUserDataFromToken(token);

    return this.tasksService.completeTask(id, getDataFromToken);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(FamilyRoles.SuperAdmin)
  @Post('add-task-status')
  createTaskStatus(@Body() dto: CreateTaskStatusDto, @Headers() headers: string) {
    const token: string = headers["authorization"].split(' ')[1];
    const getDataFromToken: IUserDataInToken = this.authService.getUserDataFromToken(token);

    return this.tasksService.createTaskStatus(dto, getDataFromToken);
  }
}
