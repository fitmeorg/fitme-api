import { Module } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { ImagesService } from '@modules/images/images.service';
import { ImagesModule } from '@modules/images/images.module';
import { TokenModule } from '@modules/token/token.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Image, ImageSchema } from '@modules/images/store/image.entity';
import { ExerciseSchema, Exercise } from './store/exercise.entity';
import {
  CategorySchema,
  Category,
} from '@modules/category/store/category.entity';
import { ImageRepository } from '@modules/images/store/image.repository';
import { ExerciseRepository } from './store/exercise.repository';
import { PaginationService } from '@modules/pagination/pagination.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Image.name, schema: ImageSchema },
      { name: Exercise.name, schema: ExerciseSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('secretToken').secretToken,
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    ImagesModule,
    TokenModule,
  ],
  controllers: [ExerciseController],
  providers: [
    ExerciseService,
    ImagesService,
    ImageRepository,
    ExerciseRepository,
    PaginationService,
  ],
})
export class ExerciseModule {}
