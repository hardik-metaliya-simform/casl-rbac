import { IsOptional, IsString, IsArray, IsInt } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsArray()
  rolesIds?: string[];

  @IsOptional()
  @IsInt()
  salary?: number;
}
