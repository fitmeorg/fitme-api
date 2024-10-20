import { Test, TestingModule } from '@nestjs/testing';
import { StreakService } from './streak.service';
import { StreakRepository } from './store/streak.repository';
import { ActivityRepository } from './store/activity.repository';
import { getQueueToken } from '@nestjs/bullmq';

describe('streak service', () => {
  let streakService: StreakService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StreakService,
        {
          provide: StreakRepository,
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: ActivityRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: getQueueToken('update'),
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    streakService = module.get<StreakService>(StreakService);
  });

  it('should be defined', () => {
    expect(streakService).toBeDefined();
  });
});
