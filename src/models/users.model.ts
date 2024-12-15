import {
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Session } from 'src/models/sessions.model';
import { Profile } from './profile.model';

interface UserCreationAttrs {
  email: string;
  password: string;
  profile: Profile;
}

@Table({ tableName: 'user' })
export class User extends Model<User, UserCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @HasMany(() => Session)
  sessions: Session[];

  @HasOne(() => Profile)
  profile: Profile;
}
