import { Image } from '@modules/images/store/Image.entity';
import { User } from '@modules/user/store/user.entity';

export class CreateClusterDto {
  readonly description: string;
  readonly members: User[];
  readonly admins: User[];
  readonly image: Image;
}
