import { IsEmail, Length, IsOptional } from 'class-validator';
export class RegisterDTO {
  readonly name: string;
  readonly username: string;
  @IsEmail()
  readonly mail: string;
  @Length(10, 15)
  @IsOptional()
  readonly phone?: string;
  readonly password: string;
  readonly timeZone: string;
}
