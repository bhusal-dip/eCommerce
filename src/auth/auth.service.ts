import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Prisma } from "@prisma/client";
import * as argon from "argon2";

import { PrismaService } from "src/database/prisma/prisma.service";
import { SignUpDto, LoginDto, RoleDto } from "src/database/dto";

@Injectable({})
export class AuthService {
    constructor(
        private configService: ConfigService,
        private prismaService: PrismaService,
        private jwtService: JwtService,
    ) { }

    async validateUser(dto: LoginDto) {

        console.log("This is validate user in auth service");

        const user = await this.prismaService.user.findUnique({
            where: {
                email: dto.email,
                id: 1,
            }
        });


        const pwMatch = await argon.verify(user.password, dto.password);

        if (user && pwMatch) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async getToken(
        userId: number,
        email: string,
        role_id: number,
    ): Promise<{
        access_token?: string;
        expiration_time?: number;
        refresh_token?: string;
    }> {
        const accessSecret = this.configService.get('JWT_ACCESS_SECRET_KEY');
        const refreshSecret = this.configService.get('JWT_REFRESH_SECRET_KEY');

        const accessExpiration = this.configService.get('ACCESS_TOKEN_EXPIRATION');
        const refreshExpiraton = this.configService.get('REFRESH_TOKEN_EXPIRATION');

        let accessToken, refreshToken;

        [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    userId,
                    email,
                },
                {
                    secret: accessSecret,
                    expiresIn: accessExpiration,
                },
            ),

            this.jwtService.signAsync(
                {
                    userId,
                    email,
                },
                {
                    secret: refreshSecret,
                    expiresIn: refreshExpiraton,
                },
            ),
        ]);


        return {
            access_token: accessToken,
            expiration_time: accessExpiration,
            refresh_token: refreshToken,
        };

    }

    async getUserData() {
        return { username: 'test' };
    }

    async login(dto: LoginDto): Promise<any> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: dto.email,
                id: 1,
            }
        });

        if (!user) {
            throw new ForbiddenException(
                'Email Doesn\'t match',
            );
        }

        const pwMatch = await argon.verify(user.password, dto.password);

        if (!pwMatch) {
            throw new ForbiddenException(
                'Incorrect Password'
            );
        }

        console.log();

        const tokens = this.getToken(user.id, user.email, user.role_id);
        return tokens;
    }

    async signUp(dto: SignUpDto) {
        console.log('in the admin register in services');
        try {
            const hashPassword = await argon.hash(dto.password);
            const user = await this.prismaService.user.create({
                data: {
                    email: dto.email,
                    password: hashPassword,
                    first_name: dto.first_name,
                    middle_name: dto.middle_name,
                    second_name: dto.second_name,
                    role_id: dto.role_id,
                },
                select: {
                    email: true,
                    first_name: true,
                    second_name: true,
                    created_at: true,
                    role: true,
                }
            });
            console.log('after');
            return user;
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                // Handle Prisma Client error
                // if (err.code === 'P2002P') {
                throw new ForbiddenException('Credentials taken');
                // }
            } else {
                // Handle other types of errors
                throw err;
            }
        }
    }

    async createRole(dto: RoleDto) {
        console.log('in the role creation in services');
        try {
            const roleData = await this.prismaService.role.create({
                data: {
                    role_id: dto.id,
                    role_name: dto.role_name,
                },
            });
            return roleData;
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                // Handle Prisma Client error
                // if (err.code === 'P2002P') {
                throw new ForbiddenException('Invalid Role');
                // }
            } else {
                // Handle other types of errors
                throw err;
            }
        }
    }
}