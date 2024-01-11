import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RoleDto {

    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    role_name: string;

}