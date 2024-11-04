import { Module } from '@nestjs/common';
import { StreakService } from './streak.service';
import { StreakController } from './streak.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Streak, StreakSchema } from './store/streak.entity';
import { TokenModule } from '@modules/token/token.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StreakRepository } from './store/streak.repository';
import { PaginationService } from '@modules/pagination/pagination.service';
import { ActivityRepository } from './store/activity.repository';
import { Activity, ActivitySchema } from './store/activity.entity';
import { BullModule } from '@nestjs/bullmq';
import { User, UserSchema } from '@modules/user/store/user.entity';
import { UserRepository } from '@modules/user/store/user.repository';
import { EventEmitterModule } from '@modules/event-emitter/event-emitter.module';
import { AuthRepository } from '@modules/auth/store/auth.repository';
import { Auth, AuthSchema } from '@modules/auth/store/auth.entity';
import { StreakConsumer } from './streak.processor';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Streak.name, schema: StreakSchema },
      { name: Activity.name, schema: ActivitySchema },
      { name: User.name, schema: UserSchema },
      { name: Auth.name, schema: AuthSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('secretToken').secretToken,
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'update',
    }),
    TokenModule,
    EventEmitterModule,
  ],
  controllers: [StreakController],
  providers: [
    StreakService,
    StreakRepository,
    PaginationService,
    ActivityRepository,
    UserRepository,
    AuthRepository,
    StreakConsumer,
  ],
  exports: [StreakRepository, StreakService],
})
export class StreakModule {}
