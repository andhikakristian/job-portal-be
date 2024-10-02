import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class RegisterUserDto {
    @IsNotEmpty()
    @IsString()
    fullName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    phoneNumber: string; 

    @IsNotEmpty()
    @IsString()
    password: string; 

    @IsOptional()
    @IsString()
    profileBio?: string;

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    profileSkills?: string[];

    @IsOptional()
    @IsUrl()
    profileResume?: string;

    @IsOptional()
    @IsString()
    profileResumeOriginalName?: string;

    @IsOptional()
    @IsString()
    profilePhoto?: string;

    @IsOptional()
    @IsString()
    role?: any
}


export class UpdateUserDto {
    @IsNotEmpty()
    @IsOptional()
    @IsString()
    fullName?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string; 

    @IsOptional()
    @IsString()
    password?: string; 

    @IsOptional()
    @IsString()
    profileBio?: string;

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    profileSkills?: string[];

    @IsOptional()
    @IsUrl()
    profileResume?: string;

    @IsOptional()
    @IsString()
    profileResumeOriginalName?: string;

    @IsOptional()
    @IsString()
    profilePhoto?: string;

    @IsOptional()
    @IsString()
    role?: any
}

export class UserResponseDto {
    id : string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role:  'student' | 'recruiter';
    profileBio?: string;
    profileSkills?: string[];
    profileResume?: string;
    profileResumeOriginalName?: string;
    profileCompanyId?: string;
    profilePhoto?: string;
    createdAt: Date;
    updatedAt: Date;
}