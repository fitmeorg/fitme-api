import { BaseRepository } from '@lib/BaseRepository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group, GroupDocument } from './group.entity';

@Injectable()
export class GroupRepository extends BaseRepository<GroupDocument> {
  constructor(
    @InjectModel(Group.name)
    private readonly groupModel: Model<GroupDocument>,
  ) {
    super(groupModel, Group.name);
  }
}
