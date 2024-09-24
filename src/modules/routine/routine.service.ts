import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { RoutineRepository } from './store/routine.repository';
import { PaginationOptions } from '@common/types';

const MAXIMUM_NUMBER_ROUTINES = 7;

@Injectable()
export class RoutineService {
  constructor(private readonly routineRepository: RoutineRepository) {}

  async createRoutine(
    paginationOptions: PaginationOptions,
    createRoutineDto: CreateRoutineDto,
  ) {
    const routines = await this.findAllRoutine(
      paginationOptions,
      createRoutineDto.createdBy.toString(),
    );

    console.log(routines.data.length);

    if (routines.data.length >= MAXIMUM_NUMBER_ROUTINES) {
      return {
        status: 403,
        message: 'You have exceeded the maximum number of routines created',
      };
    }

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
