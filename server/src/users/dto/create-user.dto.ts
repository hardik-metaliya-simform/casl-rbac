import { IsOptional, IsString, IsArray, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username!: string;

  @IsString()
  password!: string;

  @IsOptional()
  @IsArray()
  roles?: string[];

  @IsOptional()
  @IsInt()
  salary?: number;
}
