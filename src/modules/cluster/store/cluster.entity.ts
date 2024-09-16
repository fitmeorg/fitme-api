import { Image } from '@modules/images/store/Image.entity';
import { User } from '@modules/user/store/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ClusterDocument = HydratedDocument<Cluster>;

@Schema()
export class Cluster {
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
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
    default: '66cff45784042ac18c2d657a',
  })
  image: Image;
}

export const ClusterSchema = SchemaFactory.createForClass(Cluster);
