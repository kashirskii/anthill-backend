import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/users.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Profile } from 'src/models/profile.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [SequelizeModule.forFeature([User, Profile])],
  exports: [UsersService],
})
export class UsersModule {}
