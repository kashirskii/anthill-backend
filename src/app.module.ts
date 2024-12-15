import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { User } from './models/users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { Session } from './models/sessions.model';
import { ConfigModule } from '@nestjs/config';
import { Profile } from './models/profile.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'anthill',
      models: [User, Session, Profile],
      synchronize: true,
      autoLoadModels: true,
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
