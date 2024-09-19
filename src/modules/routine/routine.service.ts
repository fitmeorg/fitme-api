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
    const filter = {
      $or: [{ shareTo: user }, { createdBy: user }],
    };

    return this.routineRepository.findAll(filter, paginationOptions);
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

  async assignRoutineToUser(routineId: string, userId: any) {
    const routine = await this.routineRepository.findByIdOrFail(routineId);

    if (!routine.shareTo.includes(userId)) {
      routine.shareTo.push(userId);
    }

    return routine.save();
  }

  async shareRoutine(routineId: string, userId: any) {
    const routine = await this.routineRepository.findByIdOrFail(routineId);

    if (!routine.shareTo.includes(userId)) {
      routine.shareTo.push(userId);
    }

    return routine.save();
  }
}
