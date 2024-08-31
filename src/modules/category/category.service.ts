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
    await this.categoryRepository.create(createCategoryDto);

    return HttpStatus.CREATED;
  }

  async findAllCategories(query: PaginationQueryDto) {
    const paginationOptions =
      this.paginationService.getPaginationOptions(query);

    return this.categoryRepository.findAll({}, paginationOptions);
  }

  async findOneCategory(id: string) {
    return this.categoryRepository.findByIdOrFail(id);
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.categoryRepository.update(id, updateCategoryDto);
    return HttpStatus.OK;
  }

  async removeCategory(id: string) {
    await this.categoryRepository.remove(id);
    return HttpStatus.OK;
  }
}
