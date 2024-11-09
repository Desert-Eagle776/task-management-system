import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity, HandleHttpException } from 'src/common';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { API_RESPONSE_MESSAGE, Response } from 'src/common';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  async createCompany(
    createCompanyDto: CreateCompanyDto,
  ): Promise<Response<CompanyEntity>> {
    try {
      const checkCompanyEmail = await this.companyRepository.findOne({
        where: { email: createCompanyDto.email },
      });
      if (checkCompanyEmail) {
        throw new ConflictException(
          'The company with this email is already registered',
        );
      }

      // generation of the company's secret key
      const secretKey = crypto.randomBytes(4).toString('hex');

      const createCompany = this.companyRepository.create({
        ...createCompanyDto,
        secret_key: secretKey,
      });
      const saveCompany = await this.companyRepository.save(createCompany);

      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: saveCompany,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  async getCompanyById(id: number): Promise<Response<CompanyEntity>> {
    try {
      const company = await this.companyRepository.findOneBy({
        id,
      });
      if (!company) {
        throw new NotFoundException('Company not found');
      }

      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: company,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  async getAllCompanies(page: number): Promise<Response<CompanyEntity[]>> {
    try {
      page = page || 1;
      const limit = 10;
      const skip = (page - 1) * limit;

      const companies = await this.companyRepository.find({
        skip,
        take: limit,
      });

      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: companies,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  async updateCompany(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Response<CompanyEntity>> {
    try {
      const company = await this.companyRepository.findOneBy({ id });
      if (!company) {
        throw new NotFoundException('Company not found');
      }

      await this.companyRepository.update(id, { ...updateCompanyDto });

      const modifyCompany = await this.companyRepository.findOneBy({ id });
      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: modifyCompany,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }

  async deleteCompany(id: number): Promise<Response<any>> {
    try {
      const company = await this.companyRepository.findOneBy({ id });
      if (!company) {
        throw new NotFoundException('Company not found');
      }

      await this.companyRepository.delete(company);

      return {
        msg: API_RESPONSE_MESSAGE.SUCCESS,
        data: null,
      };
    } catch (err) {
      throw new HandleHttpException(err);
    }
  }
}
