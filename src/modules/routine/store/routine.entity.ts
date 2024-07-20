import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RoutineDocument = HydratedDocument<Routine>;

@Schema()
export class Routine {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }] })
  exercises: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }] })
  categories: string[];

  @Prop()
  exercise_example: [{ url: string; name: string }];
}

export const RoutineSchema = SchemaFactory.createForClass(Routine);
