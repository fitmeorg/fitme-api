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
import { PaginationQueryDto } from '@common/dto/pagination';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Roles } from 'src/middlewares/guards/role/role.decorator';
import { Role } from 'src/middlewares/guards/role/role.enum';

@Controller('routine')
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}

  @Post()
  @Roles([Role.Admin])
  create(@Body() createRoutineDto: CreateRoutineDto) {
    return this.routineService.createRoutine(createRoutineDto);
  }

  @Get()
  @Roles([Role.User])
  findAll(
    @Body() category: CreateCategoryDto,
    @Query() query: PaginationQueryDto,
  ) {
    return this.routineService.findAllRoutine(category, query);
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
