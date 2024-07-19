import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ExerciseDocument = HydratedDocument<Exercise>;

@Schema()
export class Exercise {
  @Prop()
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }] })
  categories: string[];

  @Prop()
  duration_minutes?: number;

  @Prop({ required: false })
  repetitions?: number;

  @Prop({ required: false })
  series?: number;

  @Prop()
  description: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }] })
  images: string[];
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
