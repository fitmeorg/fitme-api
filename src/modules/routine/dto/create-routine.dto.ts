export class CreateRoutineDto {
  readonly exercises: string[];
  readonly categories: string[];
  readonly exercise_example: [{ url: string; name: string }];
}
