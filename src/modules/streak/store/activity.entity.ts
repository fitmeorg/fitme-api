import { User } from '@modules/user/store/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date, HydratedDocument } from 'mongoose';
import { ActivityTypes } from '../types/types';

export type ActivityDocument = HydratedDocument<Activity>;

@Schema()
export class Activity {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
  @Prop({ required: true })
  type: ActivityTypes;
  @Prop({ required: true, type: Date, default: Date.now })
  date: Date;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
