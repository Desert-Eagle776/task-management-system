import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import { CreateProjectDto } from './dto/create-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project.entity';
import { Repository } from 'typeorm';
import { UserCompanyEntity } from 'src/companies/entities/user-company.entity';
import { UserPayload } from 'src/users/interfaces/user-payload';
import { UserEntity } from 'src/users/entities/user.entity';
import { IProject, IUser } from 'src/interfaces';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>
  ) { }

  async createProject(dto: CreateProjectDto, userData: UserPayload): Promise<IProject> {
    const user: IUser = await this.userRepository.findOne({
      where: {
        id: userData.user_id
      },
      relations: ['company']
    });
    if (!user) {
      throw new HttpException("User not found.", HttpStatus.NOT_FOUND);
    }

    if (!user.company) {
      throw new HttpException("The user is not in the company's space.", HttpStatus.FORBIDDEN);
    }

    const projectExists: IProject = await this.projectRepository.findOne({
      where: {
        name: dto.name,
        company: user.company
      }
    });
    if (projectExists) {
      throw new HttpException("Project with this name already exists.", HttpStatus.CONFLICT);
    }

    const project: IProject = this.projectRepository.create({ ...dto, company: user.company, createdByUser: user });
    const saveProject: IProject = await this.projectRepository.save(project);

    return saveProject;
  }

  async getOneProject(id: string, userData: UserPayload): Promise<IProject> {
    const user: IUser = await this.userRepository.findOne({
      where: {
        id: userData.user_id,
      },
      relations: ["company"]
    });

    if (!user) {
      throw new HttpException("User not found.", HttpStatus.NOT_FOUND);
    }

    if (!user.company) {
      throw new HttpException("The user is not in the company's space.", HttpStatus.FORBIDDEN);
    }

    const project: IProject = await this.projectRepository.findOne({
      where: {
        id: +id,
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
      throw new HttpException("Project not found.", HttpStatus.NOT_FOUND);
    }

    return project;
  }
}
