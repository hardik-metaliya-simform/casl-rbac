import { IsArray, IsUUID, IsNotEmpty } from 'class-validator';

export class SetRolePermissionsDto {
  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds!: string[];
}
