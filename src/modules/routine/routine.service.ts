import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { RoutineRepository } from './store/routine.repository';
import { PaginationOptions } from '@common/types';
@Injectable()
export class RoutineService {
  constructor(private readonly routineRepository: RoutineRepository) {}

  async createRoutine(createRoutineDto: CreateRoutineDto) {
    return this.routineRepository.create(createRoutineDto);
  }

  async findAllRoutine(paginationOptions: PaginationOptions, user: string) {
    return this.routineRepository.findAll(
      { createdBy: user },
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
