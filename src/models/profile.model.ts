import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './users.model';

interface ProfileCreationAttrs {
  name: string;
  secondName: string;
  userId: number;
}

@Table({ tableName: 'profile' })
export class Profile extends Model<Profile, ProfileCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, unique: false, allowNull: true })
  secondName: string;

  @ForeignKey(() => User)
  @Column
  userId: number;
}
