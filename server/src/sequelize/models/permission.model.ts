import {
  Table,
  Column,
  Model,
  PrimaryKey,
  IsUUID,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AppModuleModel } from './app.module.model';

@Table({ tableName: 'permissions', timestamps: false })
export class PermissionModel extends Model<
  PermissionModel,
  { moduleId: string; action: string }
> {
  @IsUUID(4)
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  declare id: string;

  @ForeignKey(() => AppModuleModel)
  @Column({ type: DataType.UUID })
  declare moduleId: string;

  @BelongsTo(() => AppModuleModel)
  declare module: AppModuleModel;

  @Column({ type: DataType.STRING })
  declare action: string;
}
