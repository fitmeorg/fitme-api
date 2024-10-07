import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  user: mongoose.Schema.Types.ObjectId;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  username: string;
  @Prop({ required: true })
  mail: string;
}

export const NotificationSchema = SchemaFactory.createForClass(
  Notification,
).index({ user: 1 });
