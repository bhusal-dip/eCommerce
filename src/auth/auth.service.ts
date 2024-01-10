import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Prisma } from "@prisma/client";
import * as argon from "argon2";

import { PrismaService } from "src/database/prisma/prisma.service";
import { AuthDto } from "src/database/dto";

@Injectable({})
export class AuthService {
    constructor(
        private configService: ConfigService,
        private prismaService: PrismaService,
        private jwtService: JwtService,
    ) { }

    async validateUser(dto: AuthDto) {

        console.log("This is validate user in auth service");

        const user = await this.prismaService.user.findUnique({
            where: {
                email: dto.email,
            }
        });


        const pwMatch = await argon.verify(user.password, dto.password);

        if (user && pwMatch) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async getUserData() {
        return { username: 'test' };
    }

    async login(dto: AuthDto): Promise<any> {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: dto.email,
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

        const secretJwtKey = this.configService.get('jwtConstants');

        delete user.password;


        // return user;
        return {
            access_token: await this.jwtService.signAsync(
                user,
                {
                    secret: secretJwtKey,
                    expiresIn: 60,
                }
            ),
        };
    }

    async register(dto: AuthDto) {
        try {
            const hashPassword = await argon.hash(dto.password);
            const user = await this.prismaService.user.create({
                data: {
                    email: dto.email,
                    password: hashPassword,
                },
                // select: {
                //     id: true,
                //     email: true,
                //     createdAt: true,
                // }
            });

            delete user.password;

            return user;
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                // Handle Prisma Client error
                // if (err.code === 'P2002P') {
                throw new ForbiddenException('Credeitals taken');
                // }
            } else {
                // Handle other types of errors
                throw err;
            }
        }
    }
}