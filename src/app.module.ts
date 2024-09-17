import { Module } from '@nestjs/common';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { config, configSchemaValidation } from './config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TokenModule } from './modules/token/token.module';
import { CategoryModule } from './modules/category/category.module';
import { ImagesModule } from './modules/images/images.module';
import { ExerciseModule } from './modules/exercise/exercise.module';
import { RoutineModule } from './modules/routine/routine.module';
import { CacheModule } from '@modules/cache/cache.module';
import { EventEmitterModule } from '@modules/event-emitter/event-emitter.module';
import { StreakModule } from './modules/streak/streak.module';
import { GroupModule } from './modules/group/group.module';
import { ActivityModule } from './modules/activity/activity.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: config,
      validationSchema: configSchemaValidation,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        url: configService.get('redis').url,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('database').url,
      }),
      inject: [ConfigService],
    }),
    HealthCheckModule,
    AuthModule,
    UserModule,
    TokenModule,
    CacheModule,
    EventEmitterModule,
    CategoryModule,
    ImagesModule,
    ExerciseModule,
    RoutineModule,
    StreakModule,
    GroupModule,
    ActivityModule,
  ],
})
export class AppModule {}
