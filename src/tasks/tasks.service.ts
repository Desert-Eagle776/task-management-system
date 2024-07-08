import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CompanyEntity } from 'src/companies/entities/company.entity';
import { ProjectEntity } from 'src/projects/entities/project.entity';
import { UserPayload } from 'src/users/interfaces/user-payload';
import { CreateTaskStatusDto } from './dto/create-task-status.dto';
import { TaskStatusEntity } from './entities/task-status.entity';
import { ICreateTask, IProject, ITaskStatus, IUser } from 'src/interfaces';
import { TaskEntity } from './entities/task.entity';

type UserWithoutCompany = omit<IUser, 'company'>;
type CreateTaskWithoutCompany =
  omit<ICreateTask, 'createdByUser' | 'appointedToUser'> & {
    createdByUser: UserWithoutCompany;
    appointedToUser: UserWithoutCompany;
  }

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(CompanyEntity)
    private readonly companiesRepository: Repository<CompanyEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectsRepository: Repository<ProjectEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(TaskStatusEntity)
    private readonly taskStatusRepository: Repository<TaskStatusEntity>
  ) { }

  async createTask(dto: CreateTaskDto, userData: UserPayload): Promise<ICreateTask> {
    const user: IUser = await this.usersRepository.findOne({
      where: { id: userData.user_id },
      relations: ['company'],
      select: ['id', 'fullname', 'email', 'company']
    });

    if (!user || !user.company) {
      throw new HttpException("The user or the user's company was not found.", HttpStatus.NOT_FOUND);
    }

    const appointedUser: IUser = await this.usersRepository.findOne({
      where: { id: dto.appointedUserId },
      relations: ['company'],
      select: ['id', 'fullname', 'email', 'company']
    });

    if (!appointedUser || !appointedUser.company) {
      throw new HttpException("The user or the user's company was not found.", HttpStatus.NOT_FOUND);
    }

    if (user.company.id !== appointedUser.company.id) {
      throw new HttpException("Users are not in the same company.", HttpStatus.CONFLICT);
    }

    const checkProject: IProject = await this.projectsRepository.findOne({
      where: {
        id: dto.project_id,
        company: user.company
      }
    });

    if (!checkProject) {
      throw new HttpException("There is no project with such an ID in the company.", HttpStatus.NOT_FOUND);
    }

    const checkTask: ICreateTask = await this.taskRepository.findOne({
      where: {
        name: dto.name,
        project: { id: checkProject.id },
        company: { id: user.company.id }
      },
      relations: ['project', 'company']
    });

    if (checkTask) {
      throw new HttpException("Task with this name already exists.", HttpStatus.CONFLICT);
    }

    const taskStatus: ITaskStatus = await this.taskStatusRepository.findOneBy({ name: 'Нова' });
    if (!taskStatus) {
      throw new HttpException("Task status not found.", HttpStatus.NOT_FOUND);
    }

    const task: ICreateTask = this.taskRepository.create({
      ...dto,
      appointedToUser: appointedUser,
      createdByUser: user,
      project: checkProject,
      company: user.company,
      status: taskStatus
    });

    const savedTask: ICreateTask = await this.taskRepository.save(task);

    // Delete unnecessary fields.
    const taskForClient: CreateTaskWithoutCompany = omit(savedTask, ['createdByUser.company', 'appointedToUser.company']);

    return taskForClient;
  }

  async viewTask(id: string, userData: UserPayload): Promise<ICreateTask> {
    const user: IUser = await this.usersRepository.findOneBy({ id: userData.user_id });
    if (!user) {
      throw new HttpException("User not found.", HttpStatus.NOT_FOUND);
    }

    const task: ICreateTask = await this.taskRepository.findOne({
      where: {
        id: +id,
        appointedToUser: user
      },
      relations: ['createdByUser', 'status', 'project']
    });
    if (!task) {
      throw new HttpException("Task doesn't exist.", HttpStatus.NOT_FOUND);
    }

    if (task.status.name === 'Нова') {
      const updatedStatus: ITaskStatus = await this.taskStatusRepository.findOneBy({ name: 'В роботі' });
      if (!updatedStatus) {
        throw new HttpException("Status not found.", HttpStatus.NOT_FOUND);
      }

      // update the status of the task
      await this.taskRepository.update(task.id, { status: updatedStatus });
    }

    return task;
  }

  async completeTask(id: string, userData: UserPayload) {
    const user: IUser = await this.usersRepository.findOneBy({ id: userData.user_id });
    if (!user) {
      throw new HttpException("User not found.", HttpStatus.NOT_FOUND);
    }

    const task: ICreateTask = await this.taskRepository.findOne({
      where: {
        id: +id,
        appointedToUser: user
      },
      relations: ['createdByUser', 'status', 'project']
    });

    if (!task) {
      throw new HttpException("Task doesn't exist.", HttpStatus.NOT_FOUND);
    }

    if (task.status.name === 'Завершена') {
      throw new HttpException("Task is already completed.", HttpStatus.CONFLICT);
    }

    if (task.status.name !== 'Завершена') {
      const updatedStatus: ITaskStatus = await this.taskStatusRepository.findOneBy({ name: 'Завершена' });
      if (!updatedStatus) {
        throw new HttpException("Status not found.", HttpStatus.NOT_FOUND);
      }

      // update the status of the task
      task.status = updatedStatus;

      await this.taskRepository.save(task);
    }

    return task;
  }

  async createTaskStatus(dto: CreateTaskStatusDto, userData: UserPayload): Promise<ITaskStatus> {
    const user: IUser = await this.usersRepository.findOne({
      where: {
        id: userData.user_id
      }
    });
    if (!user) {
      throw new HttpException("User not found.", HttpStatus.NOT_FOUND);
    }

    const taskStatus: ITaskStatus = await this.taskStatusRepository.findOneBy({ name: dto.name });
    if (taskStatus) {
      throw new HttpException("A task with this name already exists.", HttpStatus.CONFLICT)
    }

    const createTaskStatus: ITaskStatus = this.taskStatusRepository.create({ ...dto });
    const saveTaskStatus: ITaskStatus = await this.taskStatusRepository.save(createTaskStatus);

    return saveTaskStatus;
  }
}
