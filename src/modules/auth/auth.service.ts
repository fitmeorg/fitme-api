import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { LoginDTO } from './dto/login-auth.dto';
import { RegisterDTO } from './dto/register-auth.dto';
import { TokenService } from '../token/token.service';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './store/auth.repository';
import { UserRepository } from '../user/store/user.repository';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthProvider } from './types';
import { ForgotPassword } from './dto/forgotPassword-auth.dto';
import { ChangePassword } from './dto/changePassword-auth.dto';
import { EventEmitterService } from '@modules/event-emitter/event-emitter.service';
import { parseEntity } from '@common/util';

const SALT = 10;
const MAX_AGE = 60 * 60 * 60 * 24 * 7;
@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
    private configService: ConfigService,
    private readonly eventEmitter: EventEmitterService,
  ) {}

  async register(registerDTO: RegisterDTO) {
    const { password, name, username, mail, ...optionalOptions } = registerDTO;

    await this.authRepository.failIfExist({
      username,
    });

    const hash = await bcrypt.hash(password, SALT);

    const accessUser = await this.authRepository.create({
      password: hash,
      username,
      mail,
      ...optionalOptions,
    });

    const user = await this.userRepository.create({
      name,
      auth: accessUser,
    });

    this.eventEmitter.emitEvent('account.created', {
      user: user._id,
      username: accessUser.username,
      mail: accessUser.mail,
      name: user.name,
    });

    this.eventEmitter.emitEvent('streak.created', {
      user: parseEntity(user._id),
      timeZone: 'Europe/Paris',
    });

    return await this.tokenService.createUserToken({
      id: parseEntity(user),
      username: accessUser.username,
      roles: [...accessUser.roles],
    });
  }

  async login(loginDTO: LoginDTO) {
    const access = await this.authRepository.findLogin(loginDTO);

    const user = await this.userRepository.findOneOrFail({
      auth: parseEntity(access),
    });

    return await this.tokenService.createUserToken({
      id: parseEntity(user),
      username: access.username,
      roles: [...access.roles],
    });
  }

  async refreshToken(req: any) {
    return this.tokenService.refreshUserToken(req.user);
  }

  async authGoogle() {}

  async registerGoogle(req: any) {
    const access = await this.authRepository.create({
      mail: req.user.email,
      oauth: AuthProvider.Google,
    });

    return this.userRepository.create({
      name: req.user.name,
      auth: access,
    });
  }

  async loginGoogle(req: any) {
    const access = await this.authRepository.findUserByMail(req.user.email);

    if (!access) {
      return null;
    }

    return this.userRepository.findOne({ auth: parseEntity(access) });
  }

  async googleAuthCallback(req: any, res: Response) {
    let user = await this.loginGoogle(req);

    if (!user) {
      user = await this.registerGoogle(req);
    }

    const access = await this.authRepository.findByIdOrFail(
      parseEntity(user.auth),
    );

    const token = await this.tokenService.createUserToken({
      id: parseEntity(user),
      username: `${req.user.firstName}`,
      roles: [...access.roles],
    });

    res.cookie('access_token', token, {
      maxAge: MAX_AGE,
      sameSite: 'lax',
      secure: false,
    });

    res.redirect(this.configService.get('googleOauth.redirectUrl'));
  }

  async changePassword(changePassword: ChangePassword, req: any) {
    const token = req.cookies['access_token'];

    const userToken = await this.tokenService.validateToken(token);

    const access = await this.authRepository.findOneOrFail({
      username: userToken.username,
    });

    const comparePasswords = await bcrypt.compare(
      changePassword.currentPassword,
      access.password,
    );

    if (!comparePasswords) {
      throw new HttpException(
        'Current password is not equal',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hash = await bcrypt.hash(changePassword.newPassword, SALT);

    await this.authRepository.update(parseEntity(access), {
      password: hash,
    });

    return HttpStatus.OK;
  }

  async forgotPassword(forgotPassword: ForgotPassword) {
    const { mail } = forgotPassword;
    const userAccess = await this.authRepository.findUserByMail(mail);

    if (!userAccess) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }

    const user = await this.userRepository.findOneOrFail({
      auth: parseEntity(userAccess),
    });

    const token = this.tokenService.createUserToken({
      id: parseEntity(user),
      username: user.name,
      roles: [...userAccess.roles],
    });

    return token;
  }

  async changeForgotPassword(changePassword: ChangePassword, token: string) {
    const userToken = await this.tokenService.validateToken(token);

    const access = await this.authRepository.findOneOrFail({
      username: userToken.username,
    });

    const hash = await bcrypt.hash(changePassword.newPassword, SALT);

    await this.authRepository.update(parseEntity(access), {
      password: hash,
    });

    return HttpStatus.OK;
  }

  logout() {
    return { access_token: '' };
  }
}
