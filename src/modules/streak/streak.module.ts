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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Streak.name, schema: StreakSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('secretToken').secretToken,
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    TokenModule,
  ],
  controllers: [StreakController],
  providers: [StreakService, StreakRepository, PaginationService],
})
export class StreakModule {}
