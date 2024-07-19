import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExerciseDocument, Exercise } from './exercise.entity';
import { BaseRepository } from 'src/lib/BaseRepository';

@Injectable()
export class ExerciseRepository extends BaseRepository<ExerciseDocument> {
  constructor(
    @InjectModel(Exercise.name)
    private readonly ExerciseModel: Model<ExerciseDocument>,
  ) {
    super(ExerciseModel, Exercise.name, []);
  }
}
