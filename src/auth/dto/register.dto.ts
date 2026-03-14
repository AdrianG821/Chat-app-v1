import { IsEmail , IsString , MinLength , IsEnum} from "class-validator";

export class RegisterDto {
    @IsString()
    @MinLength(3)
    name!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;

}