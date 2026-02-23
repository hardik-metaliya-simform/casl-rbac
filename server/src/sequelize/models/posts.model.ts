import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { UserModel } from './user.model';

@Table({
  tableName: 'posts',
  timestamps: true,
  paranoid: true,
})
export class PostsModel extends Model<PostsModel> {
  @PrimaryKey
  @Default(uuidv4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(255) })
  declare title: string;

  @AllowNull(false)
  @Column({ type: DataType.TEXT })
  declare description: string;
}
