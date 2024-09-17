import { Injectable } from '@nestjs/common';
import { StreakRepository } from './store/streak.repository';
import { ActivityRepository } from './store/activity.repository';
import { parseEntity } from '@common/util';
import { ActivityTypes } from './types/types';

@Injectable()
export class StreakService {
  constructor(
    private readonly streakRepository: StreakRepository,
    private readonly activityRepository: ActivityRepository,
  ) {}

  async createActivity(type: ActivityTypes, userId: any) {
    if (!Object.values(ActivityTypes).includes(type)) {
      throw new Error('Invalid activity type');
    }

    const streak = await this.streakRepository.findOneOrFail({
      user: userId,
    });

    await this.streakRepository.update(parseEntity(streak), {
      count: streak.count + 1,
    });

    return this.activityRepository.create({
      type,
      user: userId,
    });
  }

  async createStreak(user: any) {
    return this.streakRepository.create({ user });
  }

  async findOne(user: string) {
    return this.streakRepository.findOneOrFail({ user });
  }
}
