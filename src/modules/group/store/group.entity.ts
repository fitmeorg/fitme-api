import { User } from '@modules/user/store/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type GroupDocument = HydratedDocument<Group>;

@Schema()
export class Group {
  @Prop({ required: true })
  name: string;
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: true,
  })
  admins: User[];
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: true,
  })
  members: User[];
  @Prop()
  description: string;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
