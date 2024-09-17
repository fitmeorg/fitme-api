import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { StreakService } from './streak.service';
import { Roles } from 'src/middlewares/guards/role/role.decorator';
import { Role } from 'src/middlewares/guards/role/role.enum';
import { ActivityTypes } from './types/types';

@Controller('streak')
export class StreakController {
  constructor(private readonly streakService: StreakService) {}

  @Post()
  @Roles([Role.User])
  createStreak(@Req() request: Request) {
    const user = request['user'];
    return this.streakService.createStreak(user.sub);
  }

  @Post('activity/:type')
  @Roles([Role.User])
  createActivity(@Req() request: Request, @Param('type') type: ActivityTypes) {
    const user = request['user'];
    return this.streakService.createActivity(type, user.sub);
  }

  @Get()
  @Roles([Role.User])
  findOne(@Req() request: Request) {
    const user = request['user'];
    return this.streakService.findOne(user.sub);
  }
}
