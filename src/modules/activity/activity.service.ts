import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ActivityRepository } from './store/activity.repository';
import { PaginationService } from '@modules/pagination/pagination.service';

@Injectable()
export class ActivityService {
  constructor(
    private readonly activityRepository: ActivityRepository,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createActivityDto: CreateActivityDto, user: any) {
    return this.activityRepository.create({
      ...createActivityDto,
      user: user.sub,
    });
  }

  async findAll(user: any, query) {
    const paginationOptions =
      this.paginationService.getPaginationOptions(query);

    return this.activityRepository.findAll(
      { user: user.sub },
      paginationOptions,
    );
  }

  async findOne(id: string) {
    return this.activityRepository.findById(id);
  }

  async update(id: string, updateActivityDto: UpdateActivityDto) {
    return this.activityRepository.update(id, updateActivityDto);
  }

  async remove(id: string) {
    return this.activityRepository.remove(id);
  }
}
