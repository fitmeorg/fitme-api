import { Contains } from 'class-validator';

export class ActivityDTO {
  @Contains('LIBRE')
  readonly free: string;
  @Contains('MY_RUTINA')
  readonly myRoutine: string;
  @Contains('DEPORTE')
  readonly sport: string;
  @Contains('DIETA')
  readonly diet: string;
}
