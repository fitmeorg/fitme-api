import { Injectable } from '@nestjs/common';
import { CreateClusterDto } from './dto/create-cluster.dto';
import { UpdateClusterDto } from './dto/update-cluster.dto';
import { ClusterRepository } from './store/cluster.repository';
import { PaginationService } from '@modules/pagination/pagination.service';

@Injectable()
export class ClusterService {
  constructor(
    private readonly clusterRepository: ClusterRepository,
    private paginationService: PaginationService,
  ) {}

  async create(createClusterDto: CreateClusterDto, user: any) {
    return this.clusterRepository.create({
      ...createClusterDto,
      admins: [user.sub],
    });
  }

  async findOne(id: string) {
    return this.clusterRepository.findById(id);
  }

  async findAll(user: any, query) {
    const filter = {
      $or: [{ admins: user.sub }, { members: user.sub }],
    };

    const paginationOptions =
      this.paginationService.getPaginationOptions(query);

    return this.clusterRepository.findAll(filter, paginationOptions);
  }

  async update(id: string, updateClusterDto: UpdateClusterDto) {
    return this.clusterRepository.update(id, updateClusterDto);
  }

  async remove(id: string) {
    return this.clusterRepository.remove(id);
  }
}
