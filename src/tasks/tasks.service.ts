import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { omit } from 'lodash';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskStatusDto } from './dto/create-task-status.dto';
import {
  TaskStatusEnum,
  TaskEntity,
  TaskStatusEntity,
  ProjectEntity,
  UserEntity,
  UserPayload,
  Response,
  API_RESPONSE_MESSAGE,
  HandleHttpException,
  TaskNotifications,
} from 'src/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly notificationsService: NotificationsService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectsRepository: Repository<ProjectEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(TaskStatusEntity)
    private readonly taskStatusRepository: Repository<TaskStatusEntity>,
  ) {}

  async createTask(
    createTaskDto: CreateTaskDto,
    userData: UserPayload,
  ): Promise<Response<TaskEntity>> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: userData.user_id },
        relations: ['company'],
        select: ['id', 'firstName', 'lastName', 'email', 'company'],
      });

      if (!user || !user.company) {
        throw new NotFoundException(
          "The user or the user's company was not found",
        );
      }

      const appointedUser = await this.usersRepository.findOne({
        where: { id: createTaskDto.appointedUserId },
        relations: ['company'],
        select: ['id', 'firstName', 'lastName', 'email', 'company'],
      });

      if (!appointedUser || !appointedUser.company) {
        throw new NotFoundException(
          "The user or the user's company was not found",
        );
      }

      if (user.company.id !== appointedUser.company.id) {
        throw new ConflictException('Users are not in the same company');
      }

      const project = await this.projectsRepository.findOne({
        where: {
          id: createTaskDto.projectId,
          company: user.company,
        },
      });

      if (!project) {
        throw new NotFoundException(
          'There is no project with such an ID in the company',
        );
      }

      const taskStatus = await this.taskStatusRepository.findOneBy({
        name: TaskStatusEnum.NEW,
      });
      if (!taskStatus) {
        throw new NotFoundException('Task status not found');
      }

      const task = this.taskRepository.create({
        ...createTaskDto,
        project,
        appointedToUser: appointedUser,
        createdByUser: user,
        company: user.company,
        status: taskStatus,
      });

      const savedTask = await this.taskRepository.save(task);

      // Delete unnecessary fields.
      const taskForClient = omit(savedTask, [
        'createdByUser.company',
        'appointedToUser.company',
      ]);

      await this.notificationsService.sendPush(
        appointedUser,
        TaskNotifications.NEW_TASK_ASSIGNED.title,
        TaskNotifications.NEW_TASK_ASSIGNED.body,
      );

      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: taskForClient,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  async viewTask(
    id: number,
    userData: UserPayload,
  ): Promise<Response<TaskEntity>> {
    try {
      const user = await this.usersRepository.findOneBy({
        id: userData.user_id,
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const task = await this.taskRepository.findOne({
        where: {
          id: id,
          appointedToUser: user,
        },
        relations: ['createdByUser', 'status', 'project'],
      });
      if (!task) {
        throw new NotFoundException("Task doesn't exist");
      }

      if (task.status.name === TaskStatusEnum.NEW) {
        const updatedStatus: TaskStatusEntity =
          await this.taskStatusRepository.findOneBy({
            name: TaskStatusEnum.IN_PROGRESS,
          });
        if (!updatedStatus) {
          throw new NotFoundException('Status not found');
        }

        // update the status of the task
        await this.taskRepository.update(task.id, { status: updatedStatus });
      }

      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: task,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  async completeTask(
    id: number,
    userData: UserPayload,
  ): Promise<Response<TaskEntity>> {
    try {
      const user = await this.usersRepository.findOneBy({
        id: userData.user_id,
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const task = await this.taskRepository.findOne({
        where: {
          id: id,
          appointedToUser: user,
        },
        relations: ['createdByUser', 'status', 'project'],
      });

      if (!task) {
        throw new NotFoundException("Task doesn't exist");
      }

      if (task.status.name === TaskStatusEnum.COMPLETED) {
        throw new ConflictException('Task is already completed');
      }

      if (task.status.name !== TaskStatusEnum.COMPLETED) {
        const updatedStatus = await this.taskStatusRepository.findOneBy({
          name: 'Completed',
        });
        if (!updatedStatus) {
          throw new NotFoundException('Status not found');
        }

        // update the status of the task
        task.status = updatedStatus;

        await this.taskRepository.save(task);
      }

      await this.notificationsService.sendPush(
        user,
        TaskNotifications.TASK_COMPLETED.title,
        TaskNotifications.TASK_COMPLETED.body,
      );

      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: task,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  async createTaskStatus(
    createTaskStatusDto: CreateTaskStatusDto,
    userData: UserPayload,
  ): Promise<Response<TaskStatusEntity>> {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          id: userData.user_id,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const taskStatus = await this.taskStatusRepository.findOneBy({
        name: createTaskStatusDto.name,
      });
      if (taskStatus) {
        throw new ConflictException('A task with this name already exists');
      }

      const createTaskStatus = this.taskStatusRepository.create({
        ...createTaskStatusDto,
      });
      const saveTaskStatus = await this.taskStatusRepository.save(
        createTaskStatus,
      );

      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: saveTaskStatus,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  async updateTask(
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Response<TaskEntity>> {
    try {
      const { appointedUserId, ...updateData } = updateTaskDto;

      const user = await this.usersRepository.findOne({
        where: {
          id: appointedUserId,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const task = await this.taskRepository.findOneBy({ id });
      if (!task) {
        throw new NotFoundException('Task not found');
      }

      await this.taskRepository.update(id, {
        ...updateData,
        appointedToUser: user,
      });

      const modifyTask = await this.taskRepository.findOne({
        where: { id },
        relations: ['appointedToUser'],
      });

      await this.notificationsService.sendPush(
        modifyTask.appointedToUser,
        TaskNotifications.TASK_UPDATED.title,
        TaskNotifications.TASK_UPDATED.body,
      );

      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: modifyTask,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  async deleteTask(id: number): Promise<Response<any>> {
    try {
      const task = await this.taskRepository.findOneBy({ id });
      if (!task) {
        throw new NotFoundException('Task not found');
      }

      await this.taskRepository.delete(task);

      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: task,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }
}
