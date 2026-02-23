import {
  Table,
  Column,
  Model,
  PrimaryKey,
  IsUUID,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { PermissionModel } from './permission.model';
import { RolePermission } from './role-permission.model';

@Table({ tableName: 'roles', timestamps: false })
export class RoleModel extends Model<RoleModel, { name: string }> {
  @IsUUID(4)
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare id: string;

  @Column({ unique: true })
  declare name: string;

  @BelongsToMany(() => PermissionModel, () => RolePermission)
  declare permissions: PermissionModel[];
}
