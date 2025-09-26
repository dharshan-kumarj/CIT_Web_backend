import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
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

export class LogoutDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;
}
