import { HttpStatus, Injectable } from '@nestjs/common';
import { ImagesService } from '@modules/images/images.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { ExerciseRepository } from './store/exercise.repository';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { PaginationService } from '@modules/pagination/pagination.service';
import { PaginationQueryDto } from '@common/dto/pagination';

@Injectable()
export class ExerciseService {
  constructor(
    private readonly imageService: ImagesService,
    private readonly exerciseRepository: ExerciseRepository,
    private readonly paginationService: PaginationService,
  ) {}

  async createImages(file: Array<Express.Multer.File>) {
    try {
      const imageDocument = await this.imageService.create(file);

      return imageDocument;
    } catch (error) {
      return error;
    }
  }

  async createExercise(createExerciseDto: CreateExerciseDto) {
    try {
      await this.exerciseRepository.create(createExerciseDto);
      return HttpStatus.CREATED;
    } catch (error) {
      return error;
    }
  }

  async updateExercise(id: string, updateExerciseDto: UpdateExerciseDto) {
    try {
      await this.exerciseRepository.update(id, updateExerciseDto);
      return HttpStatus.OK;
    } catch (error) {
      return error;
    }
  }

  async findExercise(id: string) {
    try {
      await this.exerciseRepository.findByIdOrFail(id);
      return HttpStatus.FOUND;
    } catch (error) {
      return error;
    }
  }

  async findAllExercise(query: PaginationQueryDto) {
    try {
      const paginationOptions =
        this.paginationService.getPaginationOptions(query);

      await this.exerciseRepository.findAll({}, paginationOptions);
      return HttpStatus.FOUND;
    } catch (error) {
      return error;
    }
  }

  async removeExercise(id: string) {
    this.exerciseRepository.remove(id);
    return HttpStatus.OK;
  }
}
