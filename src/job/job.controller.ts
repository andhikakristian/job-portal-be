import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JobService } from './job.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostJobDto } from './dto/job.dto';

@Controller('job')
export class JobController {
    constructor(private readonly jobService: JobService) {}

    //POST JOB
    @UseGuards(JwtAuthGuard)
    @Post()
    async postJob(@Req() req:any, @Body() postJobDto: PostJobDto) {
        const userId = req.user.id;
        const job = await this.jobService.postJob(userId, postJobDto)

        return {
            job,
            message: "Job created successfully",
            succes: true
        }
    }
    
    //GET ALL JOBS
    @Get()
    async getAllJobs(@Query() query: string) {
        const jobs = await this.jobService.getAllJobs(query)
        return { 
            jobs,
            success: true
         }
    }

    //GET JOB BY ID
    @Get(":id")
    async getJobById(@Param("id") jobId: string) {
        const job = await this.jobService.getJobById(jobId);
        return {
            job,
            success: true
        }
    }

    //GET JOBS BY USER ID
    @UseGuards(JwtAuthGuard)
    @Post('admin')
    async getJobByUserId(@Req() req: any){
        const userId = req.user.id;
        const jobs = await this.jobService.getJobByUserId(userId)
        return {
            jobs,
            success: true
        }
    }

    //CREATE FAVORITE BY USER ID
    @UseGuards(JwtAuthGuard)
    @Post('favorite/:id')
    async createFavorite(@Req() req, @Param("id") jobId:string) {
        const userId = req.user.id;
        const result = await this.jobService.createFavorite(jobId, userId)

        return {
            result,
            success: true
        }
    }
    
    //GET FAVORITE
    @UseGuards(JwtAuthGuard)
    @Post('favorites')
    async getFavorites(@Req() req, @Param("id") jobId:string) {
        const userId = req.user.id;
        const result = await this.jobService.getFavorite( userId)

        return {
            result,
            success: true
        }
    }
}
