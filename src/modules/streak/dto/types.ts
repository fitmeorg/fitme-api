import { IsOptional, IsIn } from 'class-validator';

export class ActivityDTO {
  @IsOptional()
  @IsIn(['FREE'])
  readonly free?: string;

  @IsOptional()
  @IsIn(['MY_ROUTINE'])
  readonly myRoutine?: string;

  @IsOptional()
  @IsIn(['SPORT'])
  readonly sport?: string;

  @IsOptional()
  @IsIn(['DIET'])
  readonly diet?: string;

  constructor(type: string) {
    const typeMapping: { [key: string]: keyof ActivityDTO } = {
      FREE: 'free',
      MY_ROUTINE: 'myRoutine',
      SPORT: 'sport',
      DIET: 'diet',
    };

    const dtoKey = typeMapping[type];
    if (!dtoKey) {
      throw new Error('Invalid type');
    }

    this[dtoKey] = type;
  }
}
