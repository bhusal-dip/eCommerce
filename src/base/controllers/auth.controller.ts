import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { JwtAuthGuard } from "src/auth/guards";
import { LoginGuard } from "src/auth/guards/login.guard";
import { LoginDto, RoleDto, SignUpDto } from "src/database/dto";
import { AuthService } from "../../auth/auth.service";


@Controller()
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(LoginGuard)
    login(@Body() dto: LoginDto) {
        console.log({
            dto,
            msg: "This is auth login contoller"
        });
        return this.authService.login(dto);
    }

    @Post('signUp')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    register(@Body() dto: SignUpDto) {
        console.log({
            dto,
        });
        return this.authService.signUp(dto);
    }

    @Get('userData')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    getUserInfo() {
        console.log("This is getUserInfo");
        return this.authService.getUserData();
    }

    @Post('userRole')
    @HttpCode(HttpStatus.CREATED)
    createRole(@Body() dto: RoleDto) {
        console.log('Creating role in controller');
        return this.authService.createRole(dto);
    }
}