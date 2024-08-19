import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { RoutineRepository } from './store/routine.repository';
import { PaginationOptions } from '@common/types';
import { CategoryRepository } from '@modules/category/store/category.repository';
@Injectable()
export class RoutineService {
  constructor(
    private readonly routineRepository: RoutineRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async createRoutine(createRoutineDto: CreateRoutineDto) {
    return this.routineRepository.create(createRoutineDto);
  }

  async findAllRoutine(paginationOptions: PaginationOptions, query: string) {
    const category = await this.categoryRepository.findOneOrFail({
      name: query,
    });

    if (category === null) {
      return this.routineRepository.findAll({}, paginationOptions);
    }

    return this.routineRepository.findAll(
      { categories: category._id },
      paginationOptions,
    );
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
