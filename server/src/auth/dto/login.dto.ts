import { IsString, IsArray, IsUUID } from 'class-validator';

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}

export class RegisterDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsArray()
  @IsUUID('4', { each: true })
  roles: string[];
}
