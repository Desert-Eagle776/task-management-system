import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FamilyRoles, RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }

  @UseGuards(JwtAuthGuard)
  @Post('add-company')
  createCompany(@Body() dto: CreateCompanyDto) {
    return this.companiesService.createCompany(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  companyById(@Param('id') id: number) {
    return this.companiesService.getCompanyById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(FamilyRoles.SuperAdmin)
  @Get()
  allCompanies() {
    return this.companiesService.getAllCompanies();
  }
}
