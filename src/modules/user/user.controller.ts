import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/middlewares/guards/role/role.decorator';
import { Role } from 'src/middlewares/guards/role/role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @Roles([Role.User])
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}
