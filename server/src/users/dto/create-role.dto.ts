import { IsNotEmpty, IsString, IsArray, IsUUID } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds: string[];
}
