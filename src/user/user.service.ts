import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { RegisterUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor( 
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {}

    //REGISTER
    async register(registerUserDto: RegisterUserDto) {
        const {
            fullName,
            email,
            phoneNumber,
            password,
            profileBio,
            profileSkills,
            profileResume, 
            profileResumeOriginalName,
            profilePhoto,
            role,
        } = registerUserDto;

        if(!fullName || !email || !phoneNumber || !password) {
            throw new BadRequestException("All fields are required")
        }
        console.log(registerUserDto, 'registerUserDto')

        const existingUser = await this.prisma.user.findUnique({ 
            where: {email},
        });
        console.log(existingUser, "existingUser");

        if (existingUser) {
            throw new BadRequestException('User already exists with this email')
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword, 'hashedPassword')

        const user = await this.prisma.user.create({
            data: {
                fullName,
                email,
                phoneNumber,
                password:hashedPassword,
                profileBio,
                profileSkills,
                profileResume,
                profileResumeOriginalName,
                profilePhoto,
                role
            },
        });

        if(!user){
            throw new BadRequestException("User not Created")
        }

        return {
            user, 
            success: true, 
            message: "Successfully user created"
        }
    }

    //LOGIN
    async login(email:string, password:string, role:string) {
        if(!email || !password || !role) {
            throw new BadRequestException('All Fields are required')
        }

        const user = await this.prisma.user.findUnique({
            where: {email}
        })
        if(!user) {
            throw new BadRequestException('User not exist')
        }

        const isPasswordMatch = await bcrypt.compare(password,user.password)
        if(!isPasswordMatch) {
            throw new BadRequestException('Incorrect email or password')
        }

        if(role !== user.role) {
            throw new BadRequestException("Account dosn't exist with current role")
        }

        const token = this.jwtService.sign(
            {userId: user.id},
            {secret:process.env.SECRET_KEY, expiresIn:"1d"}
        );

        return {
            token,
            user,
            success: true,
            message: 'Successfully loggedin user'
        }
    }

    //LOGOUT
    async logout(): Promise<{message:string; success:boolean}> {
        return {message: 'Logged Out successfully', success: true}
    }

    //UPDATE USER
    async updateProfile(id: string, updateUserDto: UpdateUserDto) {
        const {
            fullName, 
            email, 
            phoneNumber, 
            profileBio, 
            profileSkills,
            profileResume,
            profilePhoto,
        } = updateUserDto;

        if (!fullName || !email || !phoneNumber || !profileBio || !profileSkills) {
            throw new BadRequestException('All fields are required')
        }

        const user = await this.prisma.user.findUnique({
            where: {id},
            data: {
                fullName, 
                email, 
                phoneNumber, 
                profileBio, 
                profileSkills,
                profileResume,
                profilePhoto,
            }
        });

        return user;

    }
}
