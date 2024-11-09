import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ProjectEntity,
  UserEntity,
  API_RESPONSE_MESSAGE,
  Response,
  UserPayload,
  HandleHttpException,
} from 'src/common';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
  ) {}

  async createProject(
    dto: CreateProjectDto,
    userData: UserPayload,
  ): Promise<Response<ProjectEntity>> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: userData.user_id,
        },
        relations: ['company'],
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.company) {
        throw new ForbiddenException("The user is not in the company's space");
      }

      const projectExists = await this.projectRepository.findOne({
        where: {
          name: dto.name,
          company: user.company,
        },
      });
      if (projectExists) {
        throw new ConflictException('Project with this name already exists');
      }

      const project = this.projectRepository.create({
        ...dto,
        company: user.company,
        createdByUser: user,
      });
      const saveProject = await this.projectRepository.save(project);

      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: saveProject,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  async getOneProject(
    id: number,
    userData: UserPayload,
  ): Promise<Response<ProjectEntity>> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: userData.user_id,
        },
        relations: ['company'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (!user.company) {
        throw new ForbiddenException("The user is not in the company's space");
      }

      const project = await this.projectRepository.findOne({
        where: {
          id: id,
          company: user.company,
        },
        relations: [
          'createdByUser',
          'tasks',
          'tasks.status',
          'tasks.appointedToUser',
          'tasks.createdByUser',
        ],
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: project,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  async getAllProjects(page: number): Promise<Response<ProjectEntity[]>> {
    try {
      page = page || 1;
      const limit = 10;
      const skip = (page - 1) * limit;

      const projects = await this.projectRepository.find({
        skip,
        take: limit,
        relations: ['createdByUser', 'company'],
      });

      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: projects,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  async updateProject(
    id: number,
    updateProjectDto: CreateProjectDto,
  ): Promise<Response<ProjectEntity>> {
    try {
      const project = await this.projectRepository.findOneBy({
        id,
      });
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      await this.projectRepository.update(id, { ...updateProjectDto });
      const modifyProject = await this.projectRepository.findOneBy({ id });

      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: modifyProject,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  async deleteProject(id: number): Promise<Response<any>> {
    try {
      const project = await this.projectRepository.findOneBy({
        id,
      });
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      // delete project
      await this.projectRepository.delete(project);

      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: null,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }
}
