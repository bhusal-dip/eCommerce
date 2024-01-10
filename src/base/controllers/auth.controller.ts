import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards";
import { LoginGuard } from "src/auth/guards/login.guard";

import { AuthDto } from "src/database/dto";
import { AuthService } from "../../auth/auth.service";


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LoginGuard)
    login(@Body() dto: AuthDto) {
        console.log({
            dto,
            msg: "This is auth login contoller"
        });
        return this.authService.login(dto);
    }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    register(@Body() dto: AuthDto) {
        console.log({
            dto,
        });
        return this.authService.register(dto);
    }

    @Get('userData')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    getUserInfo() {
        console.log("This is getUserInfo");
        return this.authService.getUserData();
    }
}