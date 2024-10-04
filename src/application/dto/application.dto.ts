import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class AppplyJobDto {
    @IsNotEmpty()
    @IsString()
    jobId: string;
}

export class UpdateStatusDto {
    @IsNotEmpty()
    @IsEnum(['pending','accepted','rejected'])
    status: any;
}