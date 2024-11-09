import {
  Body,
  Controller,
  Post,
  Headers,
  UseGuards,
  Get,
  Param,
  Patch,
  ParseIntPipe,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateTaskStatusDto } from './dto/create-task-status.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateTaskDto } from './dto/update-task.dto';
import { IUserDataInToken, FamilyRoles } from 'src/common';

@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Internal server error',
})
@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly authService: AuthService,
    private readonly tasksService: TasksService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({
    summary: 'Create a new task',
    description:
      'This endpoint allows users to create a new task in the system',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The task has been successfully created',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The specified resource could not be found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A conflict occurred',
  })
  createTask(@Body() createTaskDto: CreateTaskDto, @Headers() headers: string) {
    const token: string = headers['authorization'].split(' ')[1];
    const getDataFromToken: IUserDataInToken =
      this.authService.getUserDataFromToken(token);

    return this.tasksService.createTask(createTaskDto, getDataFromToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Create a new task',
    description:
      'This endpoint allows users to create a new task in the system',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The task has been successfully created',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The specified resource could not be found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A conflict occurred',
  })
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @Headers() headers: string,
  ) {
    const token: string = headers['authorization'].split(' ')[1];
    const getDataFromToken: IUserDataInToken =
      this.authService.getUserDataFromToken(token);

    return this.tasksService.viewTask(id, getDataFromToken);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/complete/:id')
  @ApiOperation({
    summary: 'Mark a task as complete',
    description:
      'Marks the specified task as completed based on the provided task ID.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The task has been successfully marked as complete',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The specified resource could not be found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A conflict occurred',
  })
  markTaskAsComplete(
    @Param('id', ParseIntPipe) id: number,
    @Headers() headers: string,
  ) {
    const token: string = headers['authorization'].split(' ')[1];
    const getDataFromToken: IUserDataInToken =
      this.authService.getUserDataFromToken(token);

    return this.tasksService.completeTask(id, getDataFromToken);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(FamilyRoles.SuperAdmin)
  @Post('add-task-status')
  @ApiOperation({
    summary: 'Create a new task status',
    description: 'Creates a new status for tasks.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The task status has been successfully created',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The specified resource could not be found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A conflict occurred',
  })
  createTaskStatus(
    @Body() createTaskStatusDto: CreateTaskStatusDto,
    @Headers() headers: string,
  ) {
    const token: string = headers['authorization'].split(' ')[1];
    const getDataFromToken: IUserDataInToken =
      this.authService.getUserDataFromToken(token);

    return this.tasksService.createTaskStatus(
      createTaskStatusDto,
      getDataFromToken,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(FamilyRoles.Admin)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a task',
    description:
      'This endpoint allows users to update an existing task by providing the task ID and updated details.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The task has been successfully updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The specified resource could not be found',
  })
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(FamilyRoles.Admin)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a task',
    description:
      'This endpoint allows users to delete a specific task by providing its ID.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The task has been successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The specified resource could not be found',
  })
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.deleteTask(id);
  }
}
