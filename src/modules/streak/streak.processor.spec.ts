import { Job } from 'bullmq';
import { StreakConsumer } from './streak.processor';
import { StreakRepository } from './store/streak.repository';
import { EventEmitterService } from '@modules/event-emitter/event-emitter.service';

describe('StreakConsumer', () => {
  let streakConsumer: StreakConsumer;
  let streakRepositoryMock: jest.Mocked<StreakRepository>;
  let eventEmitterMock: jest.Mocked<EventEmitterService>;

  beforeEach(async () => {
    streakRepositoryMock = {
      findAllSelect: jest.fn(),
      updateMany: jest.fn(),
    } as any;

    eventEmitterMock = {
      emitEvent: jest.fn(),
    } as any;

    streakConsumer = new StreakConsumer(streakRepositoryMock, eventEmitterMock);
  });

  it('should process job and update streaks', async () => {
    const mockJob = { id: '1' } as Job;

    const outdatedStreaks = [{ user: 'user1' }, { user: 'user2' }];
    streakRepositoryMock.findAllSelect.mockResolvedValueOnce(outdatedStreaks);

    await streakConsumer.process(mockJob);

    expect(streakRepositoryMock.findAllSelect).toHaveBeenCalled();
    expect(streakRepositoryMock.updateMany).toHaveBeenCalledWith(
      expect.any(Object),
      { $set: { count: 0 } },
    );
    expect(eventEmitterMock.emitEvent).toHaveBeenCalledWith(
      'remove.streak',
      outdatedStreaks,
    );
  });

  it('should skip update if no outdated streaks are found', async () => {
    const mockJob = { id: '1' } as Job;
    streakRepositoryMock.findAllSelect.mockResolvedValueOnce([]);

    await streakConsumer.process(mockJob);

    expect(streakRepositoryMock.updateMany).not.toHaveBeenCalled();
    expect(eventEmitterMock.emitEvent).not.toHaveBeenCalled();
  });
});
