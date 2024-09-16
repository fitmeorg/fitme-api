import { BaseRepository } from '@lib/BaseRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cluster, ClusterDocument } from './cluster.entity';

@Injectable()
export class ClusterRepository extends BaseRepository<ClusterDocument> {
  constructor(
    @InjectModel(Cluster.name)
    private readonly clusteryModel: Model<ClusterDocument>,
  ) {
    super(clusteryModel, Cluster.name);
  }
}
