import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from './entities/company.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>
  ) { }

  async createCompany(dto: CreateCompanyDto): Promise<CompanyEntity> {
    const checkCompanyEmail: CompanyEntity = await this.companyRepository.findOne({ where: { email: dto.email } });
    if (checkCompanyEmail) {
      throw new HttpException("The company with this email is already registered", HttpStatus.CONFLICT);
    }

    // generation of the company's secret key
    const secretKey: string = crypto.randomBytes(4).toString('hex');

    const createCompany: CompanyEntity = this.companyRepository.create({ ...dto, secret_key: secretKey });
    const saveCompany: CompanyEntity = await this.companyRepository.save(createCompany);
    if (!saveCompany) {
      throw new HttpException("Error saving data", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return saveCompany;
  }

  async getCompanyById(id: number): Promise<CompanyEntity> {
    const company: CompanyEntity = await this.companyRepository.findOneBy({ id });
    if (!company) {
      throw new HttpException("Company not found", HttpStatus.BAD_REQUEST);
    }

    return company;
  }

  async getAllCompanies(page: number): Promise<CompanyEntity[]> {
    page = page || 1;
    const limit = 10;
    const skip = ((page - 1) * limit);

    const companies: CompanyEntity[] = await this.companyRepository.find({
      skip,
      take: limit
    });
    return companies;
  }
}
