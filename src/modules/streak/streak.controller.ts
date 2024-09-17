import { Controller, Get, Post, Req } from '@nestjs/common';
import { StreakService } from './streak.service';
import { Roles } from 'src/middlewares/guards/role/role.decorator';
import { Role } from 'src/middlewares/guards/role/role.enum';

@Controller('streak')
export class StreakController {
  constructor(private readonly streakService: StreakService) {}

  @Post()
  @Roles([Role.User])
  create(@Req() request: Request) {
    const user = request['user'];
    return this.streakService.create(user.sub);
  }

  @Get()
  @Roles([Role.User])
  findOne(@Req() request: Request) {
    const user = request['user'];
    return this.streakService.findOne(user.sub);
  }
}
