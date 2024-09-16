import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Req,
  Body,
} from '@nestjs/common';
import { StreakService } from './streak.service';
import { Roles } from 'src/middlewares/guards/role/role.decorator';
import { Role } from 'src/middlewares/guards/role/role.enum';
import { UpdateStreakDto } from './dto/update-streak.dto';

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

  @Patch(':id')
  @Roles([Role.User])
  update(@Param('id') id: string, @Body() updateStreak: UpdateStreakDto) {
    return this.streakService.update(id, updateStreak);
  }

  @Delete(':id')
  @Roles([Role.User])
  remove(@Param('id') id: string) {
    return this.streakService.remove(id);
  }
}
