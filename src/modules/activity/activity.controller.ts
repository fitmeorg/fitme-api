import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Roles } from 'src/middlewares/guards/role/role.decorator';
import { Role } from 'src/middlewares/guards/role/role.enum';
import { PaginationQueryDto } from '@common/dto/pagination';
import { ActivityTypes } from './types';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post(':type')
  @Roles([Role.User])
  create(@Req() request: Request, @Param('type') type: ActivityTypes) {
    const user = request['user'];
    return this.activityService.create({ type }, user);
  }

  @Get(':id')
  @Roles([Role.User])
  findOne(@Param('id') id: string) {
    return this.activityService.findOne(id);
  }

  @Get()
  @Roles([Role.User])
  findAll(@Req() request: Request, @Query() query: PaginationQueryDto) {
    const user = request['user'];
    return this.activityService.findAll(user, query);
  }

  @Patch(':id')
  @Roles([Role.User])
  update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this.activityService.update(id, updateActivityDto);
  }

  @Delete(':id')
  @Roles([Role.User])
  remove(@Param('id') id: string) {
    return this.activityService.remove(id);
  }
}
