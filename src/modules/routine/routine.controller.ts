import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
  @Roles([Role.Admin])
  create(@Body() createRoutineDto: CreateRoutineDto) {
    return this.routineService.createRoutine(createRoutineDto);
  }

  @Get()
  @Roles([Role.User])
  findAll(@Query() query: FindAllRoutineDto) {
    const paginationOptions = this.paginationService.getPaginationOptions(
      query,
      filters,
    );
    return this.routineService.findAllRoutine(
      paginationOptions,
      query.categories,
    );
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
