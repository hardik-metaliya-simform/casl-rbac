import {
  Table,
  Column,
  Model,
  PrimaryKey,
  IsUUID,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { PermissionModel } from './permission.model';

@Table({ tableName: 'modules', timestamps: false })
export class AppModuleModel extends Model<AppModuleModel, { name: string }> {
  @IsUUID(4)
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare id: string;

  @Column({ unique: true })
  declare name: string;

  @HasMany(() => PermissionModel)
  declare permissions: PermissionModel[];
}
