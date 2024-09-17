import { PartialType } from '@nestjs/swagger';
import { GroupDto } from './create-group.dto';

export class UpdateGroupDto extends PartialType(GroupDto) {}
