import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthSchema, Auth } from './store/auth.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { TokenModule } from '../token/token.module';
import { AuthRepository } from './store/auth.repository';
import { User, UserSchema } from '../user/store/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenAuthModule } from 'src/middlewares/guards/token-auth/token.module';
import { GoogleStrategy } from '@modules/auth/strategies/google.strategy';
import { GoogleOauthGuard } from 'src/middlewares/guards/google-auth/google-auth.guard';
import { EventEmitterModule } from '@modules/event-emitter/event-emitter.module';
import { PaginationService } from '@modules/pagination/pagination.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('secretToken').secretToken,
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSchema },
      { name: User.name, schema: UserSchema },
    ]),
    UserModule,
    TokenModule,
    TokenAuthModule,
    EventEmitterModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    GoogleStrategy,
    GoogleOauthGuard,
    PaginationService,
  ],
})
export class AuthModule {}
