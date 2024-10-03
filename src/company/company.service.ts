import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RegisterCompanyDto, UpdateCompanyDto } from './dto/company.dto';

@Injectable()
export class CompanyService {
    constructor(private prisma: PrismaService) {}
    
    //REGISTER COMPANY
    async registerCompany(userId: string, registerCompanyDto: RegisterCompanyDto) {
        const {
            name,
            description,
            website,
            location,
            logo
        } = registerCompanyDto

        const existingCompany = await this.prisma.company.findUnique({
            where: {name},
        });

        if(!existingCompany){
            throw new BadRequestException("Company's name is already registered")
        }

        const company = await this.prisma.company.create({
            data: {
                userId,
                name,
                description,
                website,
                location,
                logo
            },
        });

        return company
    }

    //GET COMPANIES
    async getCompanies(userId: string) {
        const companies = await this.prisma.company.findMany({
            where: {userId},
        });

        if(!companies || companies?.length == 0) {
            throw new NotFoundException("Company not found ")
        }

        return companies
    }

    //GET COMPANY BY ID
    async getCompanyById(id:string) {
        const company = await this.prisma.company.findUnique({
            where: {id}
        });

        if(!company) {
           throw new NotFoundException("Company not found") 
        }

        return company
    }

    //DELETE COMPANY BY ID
    async deleteCompanyById(id:string) {
        const company = await this.prisma.company.delete({
            where: {id}
        });

        if(!company) {
           throw new NotFoundException("Company not delete") 
        }

        return company
    }

    //UPDATE COMPANY
    async updateCompany(id:string, updateCompanyDto: UpdateCompanyDto) {
        const company = await this.prisma.company.update({
            where: {id},
            data: updateCompanyDto
        })

        if(!company) {
            throw new NotFoundException('Company not found')
        }

        return company
    }
}
