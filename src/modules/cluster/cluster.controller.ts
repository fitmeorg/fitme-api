import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { ClusterService } from './cluster.service';
import { CreateClusterDto } from './dto/create-cluster.dto';
import { UpdateClusterDto } from './dto/update-cluster.dto';
import { Roles } from 'src/middlewares/guards/role/role.decorator';
import { Role } from 'src/middlewares/guards/role/role.enum';
import { PaginationQueryDto } from '@common/dto/pagination';

@Controller('cluster')
export class ClusterController {
  constructor(private readonly clusterService: ClusterService) {}

  @Post()
  @Roles([Role.User])
  create(@Body() createClusterDto: CreateClusterDto, @Req() request: Request) {
    const user = request['user'];
    return this.clusterService.create(createClusterDto, user);
  }

  @Get(':id')
  @Roles([Role.User])
  findOne(@Param('id') id: string) {
    return this.clusterService.findOne(id);
  }

  @Get()
  @Roles([Role.User])
  findAll(@Query() query: PaginationQueryDto, @Req() request: Request) {
    const user = request['user'];
    return this.clusterService.findAll(user, query);
  }

  @Patch(':id')
  @Roles([Role.User])
  update(@Param('id') id: string, @Body() updateClusterDto: UpdateClusterDto) {
    return this.clusterService.update(id, updateClusterDto);
  }

  @Delete(':id')
  @Roles([Role.User])
  remove(@Param('id') id: string) {
    return this.clusterService.remove(id);
  }
}
