import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesEntity } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { IDeleteRole } from './interfaces/delete-role.interface';
import { IAssignRole } from './interfaces/assign-role.intarface';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: Repository<RolesEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) { }

  async addRole(dto: CreateRoleDto): Promise<RolesEntity> {
    const roleExistence: RolesEntity = await this.rolesRepository.findOne({
      where: { name: dto.name }
    });

    if (roleExistence) {
      throw new HttpException("Role already exists", HttpStatus.CONFLICT);
    }

    const createRole: RolesEntity = this.rolesRepository.create(dto);
    const saveRole: RolesEntity = await this.rolesRepository.save(createRole);

    return saveRole;
  }

  async getOneRole(id: number): Promise<RolesEntity> {
    const role: RolesEntity = await this.rolesRepository.findOne({
      where: { id: id }
    });

    if (!role) {
      throw new HttpException("Role not found", HttpStatus.NOT_FOUND);
    }

    return role;
  }

  async getAllRoles(): Promise<RolesEntity[]> {
    const roles: RolesEntity[] = await this.rolesRepository.find();
    return roles;
  }

  async deleteRole(id: number): Promise<IDeleteRole> {
    const role: RolesEntity = await this.rolesRepository.findOne({ where: { id: id } });
    if (!role) {
      throw new HttpException("Role not found", HttpStatus.NOT_FOUND);
    }

    await this.rolesRepository.delete(id);

    return { msg: "The removal was successful!" };
  }

  async assignRole(userId: number, roleId: number): Promise<IAssignRole> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    const role = await this.rolesRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new HttpException("Role not found", HttpStatus.NOT_FOUND);
    }

    await this.userRepository.save({
      id: userId,
      roles: role,
    });

    return { msg: "Role successfully updated" };
  }
}
