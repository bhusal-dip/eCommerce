import { ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class ATGuard extends AuthGuard('jwt') {
    constructor(@Inject(Reflector) private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        console.log("This is atguard");
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);
        // if (isPublic) {
        //     return true;
        // }

        // return super.canActivate(context);
        return true;
    }
}