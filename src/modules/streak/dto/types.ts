import { IsOptional, IsIn } from 'class-validator';

export class ActivityDTO {
  @IsOptional()
  @IsIn(['LIBRE'])
  readonly free?: string;

  @IsOptional()
  @IsIn(['MY_RUTINA'])
  readonly myRoutine?: string;

  @IsOptional()
  @IsIn(['DEPORTE'])
  readonly sport?: string;

  @IsOptional()
  @IsIn(['DIETA'])
  readonly diet?: string;

  constructor(type: string) {
    const typeMapping: { [key: string]: keyof ActivityDTO } = {
      LIBRE: 'free',
      MY_RUTINA: 'myRoutine',
      DEPORTE: 'sport',
      DIETA: 'diet',
    };

    const dtoKey = typeMapping[type];
    if (!dtoKey) {
      throw new Error('Invalid type');
    }

    this[dtoKey] = type;
  }
}
