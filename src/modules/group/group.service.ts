import { Injectable } from '@nestjs/common';
import { GroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupRepository } from './store/group.repository';
import { PaginationService } from '@modules/pagination/pagination.service';

@Injectable()
export class GroupService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private paginationService: PaginationService,
  ) {}

  async create(groupDto: GroupDto, user: any) {
    return this.groupRepository.create({
      ...groupDto,
      admins: [user.sub],
    });
  }

  async findOne(id: string) {
    return this.groupRepository.findById(id);
  }

  async findAll(user: any, query) {
    const filter = {
      $or: [{ admins: user.sub }, { members: user.sub }],
    };

    const paginationOptions =
      this.paginationService.getPaginationOptions(query);

    return this.groupRepository.findAll(filter, paginationOptions);
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    return this.groupRepository.update(id, updateGroupDto);
  }

  async remove(id: string) {
    return this.groupRepository.remove(id);
  }
}
