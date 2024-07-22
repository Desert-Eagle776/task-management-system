import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import { CreateProjectDto } from './dto/create-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project.entity';
import { Repository } from 'typeorm';
import { UserPayload } from 'src/users/interfaces/user-payload';
import { UserEntity } from 'src/users/entities/user.entity';
import { IDeleteProject } from './interfaces/delete-project.interface';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>
  ) { }

  async createProject(dto: CreateProjectDto, userData: UserPayload): Promise<ProjectEntity> {
    const user: UserEntity = await this.userRepository.findOne({
      where: {
        id: userData.user_id
      },
      relations: ['company']
    });
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    if (!user.company) {
      throw new HttpException("The user is not in the company's space", HttpStatus.FORBIDDEN);
    }

    const projectExists: ProjectEntity = await this.projectRepository.findOne({
      where: {
        name: dto.name,
        company: user.company
      }
    });
    if (projectExists) {
      throw new HttpException("Project with this name already exists", HttpStatus.CONFLICT);
    }

    const project: ProjectEntity = this.projectRepository.create({ ...dto, company: user.company, createdByUser: user });
    const saveProject: ProjectEntity = await this.projectRepository.save(project);

    return saveProject;
  }

  async getOneProject(id: number, userData: UserPayload): Promise<ProjectEntity> {
    const user: UserEntity = await this.userRepository.findOne({
      where: {
        id: userData.user_id,
      },
      relations: ["company"]
    });

    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    if (!user.company) {
      throw new HttpException("The user is not in the company's space", HttpStatus.FORBIDDEN);
    }

    const project: ProjectEntity = await this.projectRepository.findOne({
      where: {
        id: id,
        company: user.company,
      },
      relations: [
        "createdByUser",
        "tasks",
        "tasks.status",
        "tasks.appointedToUser",
        "tasks.createdByUser"
      ],
    });

    if (!project) {
      throw new HttpException("Project not found", HttpStatus.NOT_FOUND);
    }

    return project;
  }

  async getAllProjects(page: number): Promise<ProjectEntity[]> {
    page = page || 1;
    const limit = 10;
    const skip = ((page - 1) * limit);

    const projects: ProjectEntity[] = await this.projectRepository.find({
      skip,
      take: limit,
      relations: ['createdByUser', 'company']
    });

    return projects;
  }

  async updateProject(id: number, dto: CreateProjectDto): Promise<ProjectEntity> {
    const project: ProjectEntity = await this.projectRepository.findOneBy({ id });
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    // update project
    await this.projectRepository.update(id, { ...dto });

    const modifyProject: ProjectEntity = await this.projectRepository.findOneBy({ id });
    return modifyProject;
  }

  async deleteProject(id: number): Promise<IDeleteProject> {
    const project: ProjectEntity = await this.projectRepository.findOneBy({ id });
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    // delete project
    await this.projectRepository.delete(project);

    return { msg: 'Project successfully deleted' };
  }
}
