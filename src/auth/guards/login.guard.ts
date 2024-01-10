import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class LoginGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        // Your logic to check initial data before allowing login
        const request = context.switchToHttp().getRequest();

        // Example: Check if initial data is present in the request body
        const hasInitialData = Object.keys(request.body).length > 0;

        if (!hasInitialData) {
            // Initial data is not present, deny login
            return false;
        }

        // Initial data is present, allow login
        return true;
    }
}