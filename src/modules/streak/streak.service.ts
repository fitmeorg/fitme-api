import { Injectable } from '@nestjs/common';
import { StreakRepository } from './store/streak.repository';
import { ActivityRepository } from './store/activity.repository';
import { parseEntity } from '@common/util';
import { ActivityDTO } from './dto/types';
@Injectable()
export class StreakService {
  constructor(
    private readonly streakRepository: StreakRepository,
    private readonly activityRepository: ActivityRepository,
  ) {}

  async createActivity(type: string, userId: any) {
    const typeData: ActivityDTO = {
      free: type === 'LIBRE' ? 'LIBRE' : undefined,
      sport: type === 'DEPORTE' ? 'DEPORTE' : undefined,
      diet: type === 'DIETA' ? 'DIETA' : undefined,
      myRoutine: type === 'MY_RUTINA' ? 'MY_RUTINA' : undefined,
    };

    if (
      !typeData.free &&
      !typeData.sport &&
      !typeData.diet &&
      !typeData.myRoutine
    ) {
      throw new Error(
        'At least one of the fields must be provided (free, sport, diet, myRoutine).',
      );
    }

    const streak = await this.streakRepository.findOneOrFail({
      user: userId,
    });

    await this.streakRepository.update(parseEntity(streak), {
      count: streak.count + 1,
    });

    return this.activityRepository.create({
      type: typeData,
      user: userId,
    });
  }

  async createStreak(user: { user: any }) {
    return this.streakRepository.create(user);
  }

  async findStreak(user: any) {
    return this.streakRepository.findOne({ user });
  }
}
