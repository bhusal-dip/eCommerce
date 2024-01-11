import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class SignUpDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    second_name: string;

    @IsString()
    @IsOptional()
    middle_name: string;

    @IsNumber()
    @IsNotEmpty()
    role_id: number;
}
