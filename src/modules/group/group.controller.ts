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
import { GroupService } from './group.service';
import { GroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Roles } from 'src/middlewares/guards/role/role.decorator';
import { Role } from 'src/middlewares/guards/role/role.enum';
import { PaginationQueryDto } from '@common/dto/pagination';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @Roles([Role.User])
  create(@Body() groupDto: GroupDto, @Req() request: Request) {
    const user = request['user'];
    return this.groupService.create(groupDto, user);
  }

  @Get(':id')
  @Roles([Role.User])
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(id);
  }

  @Get()
  @Roles([Role.User])
  findAll(@Query() query: PaginationQueryDto, @Req() request: Request) {
    const user = request['user'];
    return this.groupService.findAll(user, query);
  }

  @Patch(':id')
  @Roles([Role.User])
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @Roles([Role.User])
  remove(@Param('id') id: string) {
    return this.groupService.remove(id);
  }
}
