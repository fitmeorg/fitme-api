import { User } from '@modules/user/store/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date, HydratedDocument } from 'mongoose';
import { ActivityDTO } from '../dto/types';

export type ActivityDocument = HydratedDocument<Activity>;

@Schema()
export class Activity {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
  @Prop({ required: true })
  type: ActivityDTO;
  @Prop({ required: true, type: Date, default: Date.now })
  createAt: Date;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
