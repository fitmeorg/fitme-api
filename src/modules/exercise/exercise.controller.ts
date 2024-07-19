import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  Patch,
  Param,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { CustomFileInterceptor } from '../images/file.decorator';
import { ExerciseService } from './exercise.service';
import { Role } from 'src/middlewares/guards/role/role.enum';
import { Roles } from 'src/middlewares/guards/role/role.decorator';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateCategoryDto } from '@modules/category/dto/update-category.dto';
import { PaginationQueryDto } from '@common/dto/pagination';

@Controller('exercise')
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post('images')
  @Roles([Role.Admin])
  @CustomFileInterceptor('private/exercises', 150 * 1000, ['png'], 'file', 10)
  createImages(@UploadedFiles() file: Array<Express.Multer.File>) {
    return this.exerciseService.createImages(file);
  }

  @Post()
  @Roles([Role.Admin])
  createExercise(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exerciseService.createExercise(createExerciseDto);
  }

  @Patch(':id')
  @Roles([Role.Admin])
  patchExercise(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.exerciseService.updateExercise(id, updateCategoryDto);
  }

  @Get(':id')
  @Roles([Role.User])
  findExercise(@Param('id') id: string) {
    return this.exerciseService.findExercise(id);
  }

  @Get()
  @Roles([Role.User])
  findAllExercises(@Query() query: PaginationQueryDto) {
    return this.exerciseService.findAllExercise(query);
  }

  @Delete(':id')
  @Roles([Role.Admin])
  removeExercise(@Param('id') id: string) {
    return this.exerciseService.removeExercise(id);
  }
}
