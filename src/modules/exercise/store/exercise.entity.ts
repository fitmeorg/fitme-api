import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from '@modules/category/store/category.entity';
import { Image } from '@modules/images/store/image.entity';

export type ExerciseDocument = HydratedDocument<Exercise>;

@Schema()
export class Exercise {
  @Prop()
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }] })
  categories: Category[];

  @Prop()
  durationMinutes?: number;

  @Prop()
  repetitions?: number;

  @Prop()
  series?: number;

  @Prop()
  description: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }] })
  images: Image[];
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
