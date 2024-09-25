import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoutineDocument, Routine } from './routine.entity';
import { BaseRepository } from 'src/lib/BaseRepository';

@Injectable()
export class RoutineRepository extends BaseRepository<RoutineDocument> {
  constructor(
    @InjectModel(Routine.name)
    private readonly RoutineModel: Model<RoutineDocument>,
  ) {
    super(RoutineModel, Routine.name, []);
    this.defaultPopulateOptions = this.getPopulateOptions([
      'exercises.categories',
      'exercises.images',
      'categories',
      'createdBy',
      'shareTo',
    ]);
  }
}
