import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PostJobDto } from './dto/job.dto';

@Injectable()
export class JobService {
    constructor(private prisma: PrismaService) {}

    //POST JOB
    async postJob(createdById: string, postJobDto: PostJobDto){
        const {
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experienceLevel,
            position,
            companyId
        } = postJobDto

        const job = await this.prisma.job.create({
            data: {
                title,
                description,
                requirements,
                salary,
                location,
                jobType,
                experienceLevel,
                position,
                companyId,
                createdById
            }
        })

        if(!job){
            throw new BadRequestException("Job not created")
        }

        return job
    }

    //GET ALL JOBS
    async getAllJobs(query: any) {
        const {
            keyword,
            location,
            jobType,
            salary
        } = query;

        const salaryRange = salary?.split('-');
        let jobs  = []
        if(keyword || location || jobType || salary){
            jobs = await this.prisma.job.findMany({
                where: {
                    ...(keyword  && {OR:
                        [
                            {title: {contains:keyword, mode: 'insensitive'}},
                            {description: {contains:keyword, mode: 'insensitive'}},
                        ],
                    }),
                    ...(location  && {
                            location: {contains:location, mode: 'insensitive'},
                    }),
                    ...(jobType  && {
                        jobType: {contains:jobType, mode: 'insensitive'},
                    }),

                    ...(salary && 
                        salaryRange?.length && {
                            salary: {
                                gte: parseInt(salaryRange[0], 10),
                                lte: parseInt(salaryRange[1], 10),
                            }
                    }),
                },
                include: {company: true},
                orderBy: {createdAt: 'desc'}
            });
        } else {
            jobs = await this.prisma.job.findMany({skip: 0, take: 6})
        }

        if(!jobs || jobs.length == 0) {
            throw new NotFoundException("Jobs are not found")
        }

        return jobs
    }

    //GET JOB BY ID
    async getJobById(id:string) {
        const job= await this.prisma.job.findUnique({
            where: {id},
        });
        
        if(!job){
            throw new NotFoundException("Job not found")
        }

        return job;
    }

    //GET JOBS BY USER ID
    async getJobByUserId(createdById) {
        try {
            const jobs = await this.prisma.job.findMany({
                where: {
                    createdById
                },
                include: {
                    company: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
            });

            if(!jobs || jobs?.length === 0){
                throw new NotFoundException("Job not found")
            }

            return jobs;
        } catch (error) {
            throw new NotFoundException("Job not found")

        }
    }

    //CREATE FAVORITE
    async createFavorite(jobId:string, userId:string) {
        let newFav: any;
        try {
            const fav = await this.prisma.favorite.findFirst({
                where: {jobId, userId}
            })

            if(fav){
                throw new NotFoundException("This job is already in favorite")
            }

            newFav = await this.prisma.favorite.create({
                data: {userId, jobId}
            })

            if(!newFav){
                throw new NotFoundException("Jobs not added in favorite")
            }

            return newFav
        } catch (error) {
            throw new NotFoundException("Jobs not added in favorite")
        }
    }

    //GET FAVORITE BY USER ID
    async getFavorite(userId: string) {
        try {
            const getJobs = await this.prisma.favorite.findMany({
                where: {
                    userId
                },
                include: {
                    job: {
                        include: {
                            company: true
                        }
                    }
                }
            });

            if(!getJobs?.length){
                 throw new NotFoundException('Job not found')
            }

            return getJobs;
        } catch (error) {
            throw new NotFoundException('Job not found')
        }
    }
    
}
