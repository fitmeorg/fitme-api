import { Module } from '@nestjs/common';
import { RoutineService } from './routine.service';
import { RoutineController } from './routine.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Routine, RoutineSchema } from './store/routine.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  Category,
  CategorySchema,
} from '@modules/category/store/category.entity';
import {
  Exercise,
  ExerciseSchema,
} from '@modules/exercise/store/exercise.entity';
import { PaginationService } from '@modules/pagination/pagination.service';
import { RoutineRepository } from './store/routine.repository';
import { CategoryRepository } from '@modules/category/store/category.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Routine.name, schema: RoutineSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Exercise.name, schema: ExerciseSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('secretToken').secretToken,
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [RoutineController],
  providers: [
    RoutineService,
    PaginationService,
    RoutineRepository,
    CategoryRepository,
  ],
})
export class RoutineModule {}
