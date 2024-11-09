import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignRoleDto } from './dto/assign-role.dto';
import {
  RolesEntity,
  UserEntity,
  API_RESPONSE_MESSAGE,
  Response,
  HandleHttpException,
} from 'src/common';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: Repository<RolesEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async addRole(createRoleDto: CreateRoleDto): Promise<Response<RolesEntity>> {
    try {
      const role = await this.rolesRepository.findOne({
        where: { name: createRoleDto.name },
      });

      if (role) {
        throw new ConflictException('Role already exists');
      }

      const createRole = this.rolesRepository.create(createRoleDto);
      const saveRole = await this.rolesRepository.save(createRole);

      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: saveRole,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  async getOneRole(id: number): Promise<Response<RolesEntity>> {
    try {
      const role = await this.rolesRepository.findOne({
        where: { id: id },
      });

      if (!role) {
        throw new NotFoundException('Role not found');
      }

      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: role,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  async getAllRoles(): Promise<Response<RolesEntity[]>> {
    try {
      const roles = await this.rolesRepository.find();
      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: roles,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  async deleteRole(id: number): Promise<Response<any>> {
    try {
      const role = await this.rolesRepository.findOne({
        where: { id: id },
      });
      if (!role) {
        throw new NotFoundException('Role not found');
      }

      await this.rolesRepository.delete(id);

      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: null,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  async assignRole(assignRoleDto: AssignRoleDto): Promise<Response<any>> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: assignRoleDto.userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const role = await this.rolesRepository.findOne({
        where: { id: assignRoleDto.roleId },
      });
      if (!role) {
        throw new NotFoundException('Role not found');
      }

      await this.userRepository.save({
        id: assignRoleDto.userId,
        roles: role,
      });

      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: null,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }
}
