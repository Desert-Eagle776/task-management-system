import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { ProjectEntity } from 'src/projects/entities/project.entity';
import { UserPayload } from 'src/users/interfaces/user-payload';
import { CreateTaskStatusDto } from './dto/create-task-status.dto';
import { TaskStatusEntity } from './entities/task-status.entity';
import { TaskEntity } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectsRepository: Repository<ProjectEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(TaskStatusEntity)
    private readonly taskStatusRepository: Repository<TaskStatusEntity>
  ) { }

  async createTask(dto: CreateTaskDto, userData: UserPayload): Promise<TaskEntity> {
    const user: UserEntity = await this.usersRepository.findOne({
      where: { id: userData.user_id },
      relations: ['company'],
      select: ['id', 'fullname', 'email', 'company']
    });

    if (!user || !user.company) {
      throw new HttpException("The user or the user's company was not found", HttpStatus.NOT_FOUND);
    }

    const appointedUser: UserEntity = await this.usersRepository.findOne({
      where: { id: dto.appointedUserId },
      relations: ['company'],
      select: ['id', 'fullname', 'email', 'company']
    });

    if (!appointedUser || !appointedUser.company) {
      throw new HttpException("The user or the user's company was not found", HttpStatus.NOT_FOUND);
    }

    if (user.company.id !== appointedUser.company.id) {
      throw new HttpException("Users are not in the same company", HttpStatus.CONFLICT);
    }

    const checkProject: ProjectEntity = await this.projectsRepository.findOne({
      where: {
        id: dto.project_id,
        company: user.company
      }
    });

    if (!checkProject) {
      throw new HttpException("There is no project with such an ID in the company", HttpStatus.NOT_FOUND);
    }

    const checkTask: TaskEntity = await this.taskRepository.findOne({
      where: {
        name: dto.name,
        project: { id: checkProject.id },
        company: { id: user.company.id }
      },
      relations: ['project', 'company']
    });

    if (checkTask) {
      throw new HttpException("Task with this name already exists", HttpStatus.CONFLICT);
    }

    const taskStatus: TaskStatusEntity = await this.taskStatusRepository.findOneBy({ name: 'Нова' });
    if (!taskStatus) {
      throw new HttpException("Task status not found", HttpStatus.NOT_FOUND);
    }

    const task: TaskEntity = this.taskRepository.create({
      ...dto,
      appointedToUser: appointedUser,
      createdByUser: user,
      project: checkProject,
      company: user.company,
      status: taskStatus
    });

    const savedTask: TaskEntity = await this.taskRepository.save(task);

    // Delete unnecessary fields.
    const taskForClient: TaskEntity = omit(savedTask, ['createdByUser.company', 'appointedToUser.company']);

    return taskForClient;
  }

  async viewTask(id: number, userData: UserPayload): Promise<TaskEntity> {
    const user: UserEntity = await this.usersRepository.findOneBy({ id: userData.user_id });
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    const task: TaskEntity = await this.taskRepository.findOne({
      where: {
        id: id,
        appointedToUser: user
      },
      relations: ['createdByUser', 'status', 'project']
    });
    if (!task) {
      throw new HttpException("Task doesn't exist", HttpStatus.NOT_FOUND);
    }

    if (task.status.name === 'Нова') {
      const updatedStatus: TaskStatusEntity = await this.taskStatusRepository.findOneBy({ name: 'В роботі' });
      if (!updatedStatus) {
        throw new HttpException("Status not found", HttpStatus.NOT_FOUND);
      }

      // update the status of the task
      await this.taskRepository.update(task.id, { status: updatedStatus });
    }

    return task;
  }

  async completeTask(id: number, userData: UserPayload): Promise<TaskEntity> {
    const user: UserEntity = await this.usersRepository.findOneBy({ id: userData.user_id });
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    const task: TaskEntity = await this.taskRepository.findOne({
      where: {
        id: id,
        appointedToUser: user
      },
      relations: ['createdByUser', 'status', 'project']
    });

    if (!task) {
      throw new HttpException("Task doesn't exist", HttpStatus.NOT_FOUND);
    }

    if (task.status.name === 'Завершена') {
      throw new HttpException("Task is already completed", HttpStatus.CONFLICT);
    }

    if (task.status.name !== 'Завершена') {
      const updatedStatus: TaskStatusEntity = await this.taskStatusRepository.findOneBy({ name: 'Завершена' });
      if (!updatedStatus) {
        throw new HttpException("Status not found", HttpStatus.NOT_FOUND);
      }

      // update the status of the task
      task.status = updatedStatus;

      await this.taskRepository.save(task);
    }

    return task;
  }

  async createTaskStatus(dto: CreateTaskStatusDto, userData: UserPayload): Promise<TaskStatusEntity> {
    const user: UserEntity = await this.usersRepository.findOne({
      where: {
        id: userData.user_id
      }
    });
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    const taskStatus: TaskStatusEntity = await this.taskStatusRepository.findOneBy({ name: dto.name });
    if (taskStatus) {
      throw new HttpException("A task with this name already exists", HttpStatus.CONFLICT)
    }

    const createTaskStatus: TaskStatusEntity = this.taskStatusRepository.create({ ...dto });
    const saveTaskStatus: TaskStatusEntity = await this.taskStatusRepository.save(createTaskStatus);

    return saveTaskStatus;
  }
}
