import { Module } from '@nestjs/common';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config, configSchemaValidation } from './config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TokenModule } from './modules/token/token.module';
import { CategoryModule } from './modules/category/category.module';
import { ImagesModule } from './modules/images/images.module';
import { ExerciseModule } from './modules/exercise/exercise.module';
import { RoutineModule } from './modules/routine/routine.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: config,
      validationSchema: configSchemaValidation,
    }),
    HealthCheckModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory(configService: ConfigService) {
        return { uri: configService.get('database').url };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    TokenModule,
    CategoryModule,
    ImagesModule,
    ExerciseModule,
    RoutineModule,
  ],
})
export class AppModule {}
