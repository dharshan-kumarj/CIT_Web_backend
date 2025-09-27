import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

export class LoginResponseDto {
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    userType: string;
    firstName: string;
    lastName: string;
    companyName?: string;
  };
  sessionId: string;
}

export class RegisterResponseDto {
  message: string;
  user: {
    id: number;
    email: string;
    userType: string;
    firstName: string;
    lastName: string;
    companyName?: string;
  };
}

export class LogoutDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;
}
