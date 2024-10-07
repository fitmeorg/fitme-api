import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { StreakRepository } from './store/streak.repository';
import { DateTime } from 'luxon';
import { tzCode } from './constants/timezones';
import { EventEmitterService } from '@modules/event-emitter/event-emitter.service';

@Processor('update')
export class StreakConsumer extends WorkerHost {
  constructor(
    private readonly streakRepository: StreakRepository,
    private readonly eventEmitter: EventEmitterService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>) {
    const midnightToOneAMZones: string[] = tzCode.filter((country) => {
      const nowInZone = DateTime.now().setZone(country);
      const hour = nowInZone.hour;

      return hour === 0;
    });

    const startDay = DateTime.now()
      .setZone(midnightToOneAMZones[0])
      .startOf('day')
      .toISO();

    const filterSearch = {
      count: { $gt: 0 },
      timeZone: { $in: midnightToOneAMZones },
      updatedAt: { $lte: new Date(startDay) },
    };

    const outdatedStreaks = await this.streakRepository.findAllSelect(
      filterSearch,
      'user',
    );

    if (outdatedStreaks.length > 0) {
      await this.streakRepository.updateMany(filterSearch, {
        $set: { count: 0 },
      });

      this.eventEmitter.emitEvent('remove.streak', outdatedStreaks);
    }
  }
}
