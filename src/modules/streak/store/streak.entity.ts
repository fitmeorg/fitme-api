import { User } from '@modules/user/store/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type StreakDocument = HydratedDocument<Streak>;

@Schema()
export class Streak {
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  user: User;
  @Prop({ required: true, type: Date, default: Date.now })
  last_update: Date;
  @Prop({ required: true, default: 0 })
  count: number;
}

export const StreakSchema = SchemaFactory.createForClass(Streak);
