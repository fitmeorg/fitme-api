import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenModule } from '@modules/token/token.module';
import { Activity, ActivitySchema } from './store/activity.entity';
import { ActivityRepository } from './store/activity.repository';
import { PaginationService } from '@modules/pagination/pagination.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
    ]),
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
  controllers: [ActivityController],
  providers: [ActivityService, ActivityRepository, PaginationService],
})
export class ActivityModule {}
