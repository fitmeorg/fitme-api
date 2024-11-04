import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { StreakService } from './streak.service';
import { Roles } from 'src/middlewares/guards/role/role.decorator';
import { Role } from 'src/middlewares/guards/role/role.enum';
import { EventPattern } from '@nestjs/microservices';
import { EventEmitterService } from '@modules/event-emitter/event-emitter.service';
@Controller('streak')
export class StreakController {
  constructor(
    private readonly streakService: StreakService,
    private readonly eventEmitter: EventEmitterService,
  ) {}

  @Post('activity/:type')
  @Roles([Role.User])
  createActivity(@Req() request: Request, @Param('type') type: string) {
    const user = request['user'];

    return this.streakService.createActivity(type, user.sub);
  }

  @EventPattern('streak.created')
  async createRole(user: { user: any }) {
    await this.streakService.createStreak(user);
  }

  @Get()
  @Roles([Role.User])
  findStreak(@Req() request: Request) {
    const user = request['user'];
    return this.streakService.findStreak(user.sub);
  }
}
