import { Injectable } from '@nestjs/common';
import { StreakRepository } from './store/streak.repository';

@Injectable()
export class StreakService {
  constructor(private readonly streakRepository: StreakRepository) {}

  async create(user: any) {
    return this.streakRepository.create({ user });
  }

  async findOne(user: string) {
    return this.streakRepository.findOneOrFail({ user });
  }
}
