import { User } from '@modules/user/store/user.entity';

export class GroupDto {
  readonly description: string;
  readonly members: User[];
  readonly admins: User[];
}
