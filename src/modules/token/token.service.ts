import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserTokenDTO } from './dto/user-token.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './dto/refresh-token.dto';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async createUserToken(createTokenDto: UserTokenDTO) {
    const payload = {
      sub: createTokenDto.id,
      username: createTokenDto.username,
      roles: [...createTokenDto.roles],
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async refreshUserToken(refreshToken: RefreshToken) {
    const { username, sub, roles } = refreshToken;
    const payload = { username, sub, roles };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });

    return { access_token: accessToken };
  }

  async validateToken(token: string) {
    const secret = this.configService.get('secretToken.secretToken');

    const verify = this.jwtService.verifyAsync(token, { secret });

    if (!verify) {
      throw new HttpException('Token is invalid', HttpStatus.BAD_REQUEST);
    }

    return verify;
  }
}
