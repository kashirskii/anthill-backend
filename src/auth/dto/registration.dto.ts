import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegistrationDTO {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly name: string;
}
