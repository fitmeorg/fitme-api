import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { RoutineService } from './routine.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { FindAllRoutineDto } from './dto/category.dto';
import { Roles } from 'src/middlewares/guards/role/role.decorator';
import { Role } from 'src/middlewares/guards/role/role.enum';
import { filters } from './pagination/filter';
import { PaginationService } from '@modules/pagination/pagination.service';

@Controller('routine')
export class RoutineController {
  constructor(
    private readonly routineService: RoutineService,
    private readonly paginationService: PaginationService,
  ) {}

  @Post()
  @Roles([Role.User])
  create(@Body() createRoutineDto: CreateRoutineDto, @Req() request: Request) {
    const user = request['user'];
    return this.routineService.createRoutine({
      ...createRoutineDto,
      createdBy: user.sub,
    });
  }

  @Post(':routineId/assign')
  @Roles([Role.User])
  assignRoutine(
    @Param('routineId') routineId: string,
    @Req() request: Request,
  ) {
    const user = request['user'];
    return this.routineService.assignRoutineToUser(routineId, user.sub);
  }

  @Post(':routineId/share/:userId')
  @Roles([Role.User])
  shareRoutine(
    @Param('userId') userId: string,
    @Param('routineId') routineId: string,
  ) {
    return this.routineService.shareRoutine(routineId, userId);
  }

  @Get()
  @Roles([Role.User])
  findAll(@Query() query: FindAllRoutineDto, @Req() request: Request) {
    const paginationOptions = this.paginationService.getPaginationOptions(
      query,
      filters,
    );
    const user = request['user'];
    return this.routineService.findAllRoutine(paginationOptions, user.sub);
  }

  @Get(':id')
  @Roles([Role.User])
  findOne(@Param('id') id: string) {
    return this.routineService.findOneRoutine(id);
  }

  @Patch(':id')
  @Roles([Role.Admin])
  update(@Param('id') id: string, @Body() updateRoutineDto: UpdateRoutineDto) {
    return this.routineService.updateRoutine(id, updateRoutineDto);
  }

  @Delete(':id')
  @Roles([Role.Admin])
  remove(@Param('id') id: string) {
    return this.routineService.removeRoutine(id);
  }
}
