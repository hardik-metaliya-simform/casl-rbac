import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { UserModel } from './user.model';
import { RoleModel } from './role.model';

@Table({ tableName: 'user_roles', timestamps: false })
export class UserRole extends Model<UserRole> {
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.UUID, field: 'usersId' })
  declare userId: string;

  @ForeignKey(() => RoleModel)
  @Column({ type: DataType.UUID, field: 'rolesId' })
  declare roleId: string;
}
