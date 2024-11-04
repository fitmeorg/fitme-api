import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/middlewares/guards/role/role.enum';
import { Factory } from 'nestjs-seeder';

export type AuthDocument = HydratedDocument<Auth>;

@Schema()
export class Auth {
  @Prop({
    sparse: true,
    unique: true,
    trim: true,
  })
  mail: string;

  @Factory(() => {
    const number = Math.random() * (1000000000000 - 1000000000) + 1000000000;
    return number.toString();
  })
  @Prop({ sparse: true, unique: true, trim: true, min: 10, max: 15 })
  phone: string;

  @Prop({ sparse: true, unique: true, trim: true })
  username: string;

  @Prop()
  password: string;

  @Prop()
  oauth: string;

  @Factory(['user'])
  @Prop({ default: [Role.User] })
  roles: Role[];
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
