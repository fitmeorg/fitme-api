import { Module } from '@nestjs/common';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config, configSchemaValidation } from './config';
import { MongooseModule } from '@nestjs/mongoose';

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
  ],
})
export class AppModule {}
