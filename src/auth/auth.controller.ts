import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDTO } from './dto/registration.dto';
import { Request, Response } from 'express';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  async login(@Res() res: Response, @Body() loginDTO: LoginDTO) {
    const tokens = await this.authService.login(loginDTO);
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({ access_token: tokens.access_token });
  }

  @Post('registration')
  async registration(
    @Res() res: Response,
    @Body() registraionDTO: RegistrationDTO,
  ) {
    const tokens = await this.authService.registration(registraionDTO);
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({ access_token: tokens.access_token });
  }

  @HttpCode(200)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const refresh_token = req.cookies['refresh_token'];
    if (!refresh_token) {
      throw new BadRequestException('Token is missing');
    }

    res.clearCookie('refresh_token');
    await this.authService.logout(refresh_token);

    return res.json();
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refresh_token = req.cookies['refresh_token'];

    const tokens = await this.authService.refresh(refresh_token);

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({ access_token: tokens.access_token });
  }
}
