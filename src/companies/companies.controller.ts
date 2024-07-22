import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
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
  companyById(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.getCompanyById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(FamilyRoles.SuperAdmin)
  @Get('all/:page')
  allCompanies(@Param('page', ParseIntPipe) page: number) {
    return this.companiesService.getAllCompanies(page);
  }
}
