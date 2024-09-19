import { Category } from '@modules/category/store/category.entity';
import { Exercise } from '@modules/exercise/store/exercise.entity';
import { User } from '@modules/user/store/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RoutineDocument = HydratedDocument<Routine>;

@Schema()
export class Routine {
  @Prop()
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }] })
  exercises: Exercise[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }] })
  categories: Category[];

  @Prop()
  exerciseExample: [{ url: string; name: string }];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  shareTo: User[];
}

export const RoutineSchema = SchemaFactory.createForClass(Routine);

RoutineSchema.index({ name: 'text' });
