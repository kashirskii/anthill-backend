import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Profile } from 'src/models/profile.model';
import { User } from 'src/models/users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Profile) private profileRepository: typeof Profile,
  ) {}

  async findById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id: id } });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    return user;
  }

  async createUser(
    email: string,
    password: string,
    name: string,
  ): Promise<User | null> {
    const user = await this.userRepository.create({
      email: email,
      password: password,
    });

    await this.profileRepository.create({ name: name, userId: user.id });

    return user;
  }
}
