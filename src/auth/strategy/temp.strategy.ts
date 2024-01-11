import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { LoginDto } from "src/database/dto";
import { PrismaService } from "src/database/prisma/prisma.service";

@Injectable()
export class TempStrategy extends PassportStrategy(Strategy, 'temp') {
    constructor(config: ConfigService, private prismaService: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('JWT_ACCESS_SECRET_KEY')
        });
    }

    async validate(dto: LoginDto) {
        console.log('This is the login startegy');
        const user = this.prismaService.user.findUnique({
            where: {
                email: dto.email,
                id: 1,
            }
        });
        if (user) {
            return dto;
        }
    }
}