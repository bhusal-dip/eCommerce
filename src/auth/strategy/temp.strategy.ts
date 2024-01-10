import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthDto } from "src/database/dto";
import { PrismaService } from "src/database/prisma/prisma.service";

@Injectable()
export class TempStrategy extends PassportStrategy(Strategy, 'temp') {
    constructor(config: ConfigService, private prismaService: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('jwtConstants')
        });
    }

    async validate(dto: AuthDto) {
        console.log('This is the login startegy');
        const user = this.prismaService.user.findUnique({
            where: {
                email: dto.email,
            }
        });
        if (user) {
            return dto;
        }
    }
}