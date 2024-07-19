export class CreateExerciseDto {
  readonly name: string;
  readonly categories: string[];
  readonly duration_minutes?: number;
  readonly repetitions?: number;
  readonly series?: number;
  readonly description: string;
  readonly images: string[];
}
