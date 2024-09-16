import { Injectable } from '@nestjs/common';
import { UpdateStreakDto } from './dto/update-streak.dto';
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

  async update(id: string, updateStreakDto: UpdateStreakDto) {
    return this.streakRepository.update(id, {
      ...updateStreakDto,
      last_update: new Date(),
    });
  }

  async remove(id: string) {
    return this.streakRepository.remove(id);
  }
}
