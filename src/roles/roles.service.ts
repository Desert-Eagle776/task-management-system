import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesEntity } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IRole } from 'src/interfaces';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: Repository<RolesEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) { }

  async addRole(dto: CreateRoleDto): Promise<IRole> {
    const roleExistence: IRole | null = await this.rolesRepository.findOne({
      where: { name: dto.name }
    });

    if (roleExistence) {
      throw new HttpException("Role already exists.", HttpStatus.CONFLICT);
    }

    const createRole: IRole = this.rolesRepository.create(dto);
    const saveRole: IRole = await this.rolesRepository.save(createRole);

    return saveRole;
  }

  async getOneRole(id: string): Promise<IRole> {
    const role: IRole | null = await this.rolesRepository.findOne({
      where: { id: +id }
    });

    if (!role) {
      throw new HttpException("Role not found.", HttpStatus.NOT_FOUND);
    }

    return role;
  }

  async getAllRoles(): Promise<IRole[]> {
    const roles: IRole[] = await this.rolesRepository.find();
    return roles;
  }

  async deleteRole(id: string): Promise<{ msg: string }> {
    const role: IRole = await this.rolesRepository.findOne({ where: { id: +id } });
    if (!role) {
      throw new HttpException("Role not found.", HttpStatus.NOT_FOUND);
    }

    await this.rolesRepository.delete(+id);

    return { msg: "The removal was successful!" };
  }

  async assignRole(userId: string) {
    const userToAssignRole = await this.userRepository.findOne({
      where: {
        id: +userId,
      }
    });

    if (!userToAssignRole) {
      throw new HttpException("User not found.", HttpStatus.NOT_FOUND);
    }


  }
}
