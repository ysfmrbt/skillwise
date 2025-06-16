import { IsEmail, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  name: string;
}

export class RegisterResponseDto {
  message: string;
  accessToken: string;
}
