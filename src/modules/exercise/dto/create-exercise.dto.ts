import { Category } from '@modules/category/store/category.entity';
import { Image } from '@modules/images/store/Image.entity';
export class CreateExerciseDto {
  readonly name: string;
  readonly categories: Category[];
  readonly duration_minutes?: number;
  readonly repetitions?: number;
  readonly series?: number;
  readonly description: string;
  readonly images: Image[];
}
