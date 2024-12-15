import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
