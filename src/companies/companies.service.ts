import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from './entities/company.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { ICompany, ICreateCompany } from 'src/interfaces';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>
  ) { }

  async createCompany(dto: CreateCompanyDto): Promise<ICompany> {
    const checkCompanyEmail: ICompany | null = await this.companyRepository.findOne({ where: { email: dto.email } });
    if (checkCompanyEmail) {
      throw new HttpException("The company with this email is already registered.", HttpStatus.CONFLICT);
    }

    // generation of the company's secret key
    const secretKey: string = crypto.randomBytes(4).toString('hex');

    const createCompany: ICreateCompany = this.companyRepository.create({ ...dto, secret_key: secretKey });
    const saveCompany: ICompany = await this.companyRepository.save(createCompany);
    if (!saveCompany) {
      throw new HttpException("Error saving data.", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return saveCompany;
  }

  async getCompanyById(id: number): Promise<ICompany> {
    const company: ICompany | undefined = await this.companyRepository.findOneBy({ id });
    if (!company) {
      throw new HttpException("Company not found.", HttpStatus.BAD_REQUEST);
    }

    return company;
  }

  async getAllCompanies(): Promise<ICompany[]> {
    const companies: ICompany[] = await this.companyRepository.find();
    return companies;
  }
}
