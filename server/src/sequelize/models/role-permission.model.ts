import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { RoleModel } from './role.model';
import { PermissionModel } from './permission.model';

@Table({ tableName: 'role_permissions', timestamps: false })
export class RolePermission extends Model<RolePermission> {
  @ForeignKey(() => RoleModel)
  @Column({ type: DataType.UUID, field: 'rolesId' })
  declare roleId: string;

  @ForeignKey(() => PermissionModel)
  @Column({ type: DataType.UUID, field: 'permissionsId' })
  declare permissionId: string;
}
