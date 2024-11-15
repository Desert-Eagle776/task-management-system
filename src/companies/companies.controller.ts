import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { FamilyRoles } from 'src/common';

@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Internal server error',
})
@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({
    summary: 'Create a new company',
    description:
      'This endpoint allows users to create a new company in the system.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The company has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A conflict occurred.',
  })
  createCompany(@Body() dto: CreateCompanyDto) {
    return this.companiesService.createCompany(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a company by ID',
    description:
      'This endpoint retrieves detailed information about a company based on the provided company ID.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The company details have been successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The specified resource could not be found.',
  })
  companyById(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.getCompanyById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(FamilyRoles.SuperAdmin)
  @Get('all/:page')
  @ApiOperation({
    summary: 'Retrieve a paginated list of all companies',
    description:
      'This endpoint provides a paginated list of all companies in the system.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The list of companies has been successfully retrieved.',
  })
  allCompanies(@Param('page', ParseIntPipe) page: number) {
    return this.companiesService.getAllCompanies(page);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(FamilyRoles.Admin)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update an existing company',
    description:
      'This endpoint allows users to update the details of an existing company by specifying the company ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The company has been successfully updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The specified resource could not be found',
  })
  updateCompany(
    @Param('id', ParseIntPipe) id: number,
    updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.updateCompany(id, updateCompanyDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(FamilyRoles.Admin)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a company by ID',
    description:
      'This endpoint allows the deletion of a company based on the provided company ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The company has been successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The specified resource could not be found',
  })
  deleteCompany(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.deleteCompany(id);
  }
}
