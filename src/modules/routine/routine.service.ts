import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { RoutineRepository } from './store/routine.repository';
import { PaginationQueryDto } from '@common/dto/pagination';
import { PaginationService } from '@modules/pagination/pagination.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryRepository } from '@modules/category/store/category.repository';

@Injectable()
export class RoutineService {
  constructor(
    private readonly routineRepository: RoutineRepository,
    private readonly paginationService: PaginationService,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async createRoutine(createRoutineDto: CreateRoutineDto) {
    return this.routineRepository.create(createRoutineDto);
  }

  async findAllRoutine(category: CreateCategoryDto, query: PaginationQueryDto) {
    const categoryDocument = await this.categoryRepository.findOneOrFail({
      name: category.category,
    });

    const paginationOptions =
      this.paginationService.getPaginationOptions(query);

    const { data } = await this.routineRepository.findAll(
      { categories: `${categoryDocument._id}` },
      paginationOptions,
    );
    return data;
  }

  async findOneRoutine(id: string) {
    return this.routineRepository.findByIdOrFail(id);
  }

  async updateRoutine(id: string, updateRoutineDto: UpdateRoutineDto) {
    return this.routineRepository.update(id, updateRoutineDto);
  }

  async removeRoutine(id: string) {
    await this.routineRepository.remove(id);
    return HttpStatus.OK;
  }
}
