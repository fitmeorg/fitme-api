import { Job } from 'bullmq';
import { StreakConsumer } from './streak.processor';
import { StreakRepository } from './store/streak.repository';
import { EventEmitterService } from '@modules/event-emitter/event-emitter.service';

describe('StreakConsumer', () => {
  let streakConsumer: StreakConsumer;
  let streakRepositoryMock: jest.Mocked<StreakRepository>;
  let eventEmitterMock: jest.Mocked<EventEmitterService>;

  beforeEach(() => {
    streakRepositoryMock = {
      findAllSelect: jest.fn(),
      updateMany: jest.fn(),
    } as any;

    eventEmitterMock = {
      emitEvent: jest.fn(),
    } as any;

    streakConsumer = new StreakConsumer(streakRepositoryMock, eventEmitterMock);
  });

  it('should process and update streaks in batches of 0, 5000, 10000, and 90000', async () => {
    const mockJob = { id: '1' } as Job;

    const batch1 = new Array(5000).fill({ user: 'user1' });
    const batch2 = new Array(10000).fill({ user: 'user2' });
    const batch3 = new Array(90000).fill({ user: 'user3' });

    streakRepositoryMock.findAllSelect
      .mockResolvedValueOnce(batch1)
      .mockResolvedValueOnce(batch2)
      .mockResolvedValueOnce(batch3)
      .mockResolvedValueOnce([]);

    await streakConsumer.process(mockJob);

    expect(streakRepositoryMock.findAllSelect).toHaveBeenCalledTimes(4);

    expect(streakRepositoryMock.updateMany).toHaveBeenCalledTimes(3);
    expect(streakRepositoryMock.updateMany).toHaveBeenCalledWith(
      { user: { $in: batch1 } },
      { $set: { count: 0 } },
    );
    expect(streakRepositoryMock.updateMany).toHaveBeenCalledWith(
      { user: { $in: batch2 } },
      { $set: { count: 0 } },
    );
    expect(streakRepositoryMock.updateMany).toHaveBeenCalledWith(
      { user: { $in: batch3 } },
      { $set: { count: 0 } },
    );

    expect(eventEmitterMock.emitEvent).toHaveBeenCalledTimes(3);
    expect(eventEmitterMock.emitEvent).toHaveBeenCalledWith(
      'remove.streak',
      batch1,
    );
    expect(eventEmitterMock.emitEvent).toHaveBeenCalledWith(
      'remove.streak',
      batch2,
    );
    expect(eventEmitterMock.emitEvent).toHaveBeenCalledWith(
      'remove.streak',
      batch3,
    );
  });
});
