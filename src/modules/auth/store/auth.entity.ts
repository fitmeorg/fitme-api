import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/middlewares/guards/role/role.enum';

export type AuthDocument = HydratedDocument<Auth>;

@Schema()
export class Auth {
  @Prop({
    sparse: true,
    unique: true,
    trim: true,
  })
  mail: string;

  @Prop({ sparse: true, unique: true, trim: true, min: 10, max: 15 })
  phone: string;

  @Prop({ sparse: true, unique: true, trim: true })
  username: string;

  @Prop()
  password: string;

  @Prop({ sparse: true, unique: true })
  oauth: string;

  @Prop({ default: [Role.User] })
  roles: Role[];
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
