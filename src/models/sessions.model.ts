import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './users.model';

interface SessionCreationAttrs {
  id: number;
  userId: number;
  refreshToken: string;
}

@Table({ tableName: 'session' })
export class Session extends Model<Session, SessionCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  refreshToken: string;
}
