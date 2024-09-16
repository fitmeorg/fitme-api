import { BaseRepository } from '@lib/BaseRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Activity, ActivityDocument } from './activity.entity';
import { Model } from 'mongoose';

@Injectable()
export class ActivityRepository extends BaseRepository<ActivityDocument> {
  constructor(
    @InjectModel(Activity.name)
    private readonly activityModel: Model<ActivityDocument>,
  ) {
    super(activityModel, Activity.name);
  }
}
