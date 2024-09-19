import { Controller, Param, Post, Req } from '@nestjs/common';
import { StreakService } from './streak.service';
import { Roles } from 'src/middlewares/guards/role/role.decorator';
import { Role } from 'src/middlewares/guards/role/role.enum';
import { ActivityDTO } from './dto/types';
import { EventPattern } from '@nestjs/microservices';
@Controller('streak')
export class StreakController {
  constructor(private readonly streakService: StreakService) {}

  @Post('activity/:type')
  @Roles([Role.User])
  createActivity(@Req() request: Request, @Param('type') type: ActivityDTO) {
    const user = request['user'];
    return this.streakService.createActivity(type, user.sub);
  }

  @EventPattern('streak.created')
  async createRole(user: { user: any }) {
    await this.streakService.createStreak(user);
  }
}
