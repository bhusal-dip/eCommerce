import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "src/base/controllers";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards";
import { JwtStrategy, LocalStrategy, TempStrategy } from "./strategy";

@Module({
    imports: [JwtModule.register({})],
    controllers: [
        AuthController,
    ],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        TempStrategy,
        JwtAuthGuard,
    ],
})
export class AuthModule { }