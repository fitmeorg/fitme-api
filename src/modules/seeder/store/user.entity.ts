import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Auth } from '@modules/auth/store/auth.entity';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop()
  imageProfile?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    unique: true,
  })
  auth: Auth;
}

export const UserSchema = SchemaFactory.createForClass(User);
