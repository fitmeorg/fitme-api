import { Module } from '@nestjs/common';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
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
import { SeederModule } from './modules/seeder/seeder.module';
import { ScheduleModule } from '@nestjs/schedule';

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
        connection: {
          host: configService.get('bullmq').host,
          port: configService.get('bullmq').port,
        },
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
    ScheduleModule.forRoot(),
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
    SeederModule,
  ],
})
export class AppModule {}
