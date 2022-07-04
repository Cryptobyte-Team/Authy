/* ESLint is confused by decorators.. */
/* eslint-disable indent */

import { IsDefined, IsEmail, Length } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsDefined()
  email: string;

  @IsDefined()
  @Length(8)
  password: string;
}
