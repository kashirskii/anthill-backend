import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/users.model';
import { RegistrationDTO } from './dto/registration.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { Session } from '../models/sessions.model';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Session) private sessionRepository: typeof Session,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(
    loginDTO: LoginDTO,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.validateUser(loginDTO);
    const tokens = await this.generateTokens(user);

    await this.createSession(tokens.refresh_token, user.id);

    return tokens;
  }

  async registration(
    registraionDTO: RegistrationDTO,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const candidate = await this.usersService.findByEmail(registraionDTO.email);
    if (candidate) {
      throw new ConflictException('A user already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(registraionDTO.password, salt);

    const user = await this.usersService.createUser(
      registraionDTO.email,
      hashPassword,
      registraionDTO.name,
    );

    const tokens = await this.generateTokens(user);
    await this.createSession(tokens.refresh_token, user.id);

    return tokens;
  }

  async refresh(
    refresh_token: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      await this.jwtService.verifyAsync(refresh_token, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });
    } catch {
      throw new UnauthorizedException('token invalid');
    }

    const session = await this.sessionRepository.findOne({
      where: { refreshToken: refresh_token },
    });
    if (!session) {
      throw new UnauthorizedException('token invalid');
    }

    const user = await this.usersService.findById(session.userId);
    const tokens = await this.generateTokens(user);

    await this.sessionRepository.update(
      {
        refreshToken: tokens.refresh_token,
      },
      { where: { id: session.id } },
    );

    return tokens;
  }

  async logout(refresh_token: string) {
    return await this.sessionRepository.destroy({
      where: { refreshToken: refresh_token },
    });
  }

  private async validateUser(loginDTO: LoginDTO): Promise<User> {
    const user = await this.usersService.findByEmail(loginDTO.email);
    if (!user) {
      throw new UnauthorizedException('Incorrect login');
    }

    const passwordEquals = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );

    if (passwordEquals) {
      return user;
    }
    throw new UnauthorizedException('Incorrect password');
  }

  private async generateTokens(
    user: User,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: user.id,
          email: user.email,
        },
        {
          expiresIn: '30s',
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        },
      ),
      this.jwtService.signAsync(
        {
          id: user.id,
          email: user.email,
        },
        {
          expiresIn: '30d',
          secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        },
      ),
    ]);

    return {
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }

  private async createSession(
    refresh_token: string,
    userId: number,
  ): Promise<null> {
    await this.sessionRepository.create({
      userId: userId,
      refreshToken: refresh_token,
    });

    return null;
  }
}
