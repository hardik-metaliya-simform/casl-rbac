import {
  Table,
  Column,
  Model,
  PrimaryKey,
  IsUUID,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { RoleModel } from './role.model';
import { UserRole } from './user-role.model';

@Table({ tableName: 'users', timestamps: false })
export class UserModel extends Model<
  UserModel,
  { username: string; password: string }
> {
  @IsUUID(4)
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare id: string;

  @Column({ unique: true })
  declare username: string;

  @Column({ type: DataType.STRING })
  declare password: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  declare salary: number | null;

  @BelongsToMany(() => RoleModel, () => UserRole)
  declare roles: RoleModel[];
}
