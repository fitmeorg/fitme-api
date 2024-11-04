import { PaginationQueryDto } from '@common/dto/pagination';

export class FindAuthDto extends PaginationQueryDto {
  readonly username: string;
}
