import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './store/category.repository';
import { PaginationQueryDto } from '@common/dto/pagination';
import { PaginationService } from '@modules/pagination/pagination.service';

@Injectable()
export class CategoryService {
  constructor(
    private categoryRepository: CategoryRepository,
    private paginationService: PaginationService,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      await this.categoryRepository.create(createCategoryDto);

      return HttpStatus.CREATED;
    } catch (error) {
      return HttpStatus.BAD_REQUEST;
    }
  }

  async findAllCategories(query: PaginationQueryDto) {
    try {
      const paginationOptions =
        this.paginationService.getPaginationOptions(query);

      return this.categoryRepository.findAll({}, paginationOptions);
    } catch (error) {
      return HttpStatus.NOT_FOUND;
    }
  }

  async findOneCategory(id: string) {
    try {
      return this.categoryRepository.findByIdOrFail(id);
    } catch (error) {
      return error;
    }
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      await this.categoryRepository.update(id, updateCategoryDto);
      return HttpStatus.OK;
    } catch (error) {
      return error;
    }
  }

  async removeCategory(id: string) {
    try {
      await this.categoryRepository.remove(id);
      return HttpStatus.OK;
    } catch (error) {
      return error;
    }
  }
}
