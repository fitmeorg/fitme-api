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

    let outdatedStreaks = [''];

    while (outdatedStreaks.length > 0) {
      outdatedStreaks = await this.streakRepository.findAllSelect(
        {
          count: { $gt: 0 },
          timeZone: { $in: midnightToOneAMZones },
          updatedAt: { $lte: new Date(startDay) },
        },
        'user',
        10000,
      );

      if (outdatedStreaks.length > 0) {
        await this.streakRepository.updateMany(
          { user: { $in: outdatedStreaks } },
          {
            $set: { count: 0 },
          },
        );
        this.eventEmitter.emitEvent('remove.streak', outdatedStreaks);
      }
    }
  }
}
