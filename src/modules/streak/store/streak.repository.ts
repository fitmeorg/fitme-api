import { BaseRepository } from '@lib/BaseRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Streak, StreakDocument } from './streak.entity';
import { Model } from 'mongoose';

@Injectable()
export class StreakRepository extends BaseRepository<StreakDocument> {
  constructor(
    @InjectModel(Streak.name)
    private readonly streakModel: Model<StreakDocument>,
  ) {
    super(streakModel, Streak.name);
  }
}
