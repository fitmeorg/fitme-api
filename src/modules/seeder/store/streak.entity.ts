import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Factory } from 'nestjs-seeder';
import { tzCode } from '../constants/timezones';
import { faker } from '@faker-js/faker';
import { User } from './user.entity';

export type StreakDocument = HydratedDocument<Streak>;
@Schema()
export class Streak {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
  })
  @Prop({ required: true })
  user: User;

  @Factory(() => faker.date.between({ from: '2024-10-01', to: Date.now() }))
  @Prop({ required: true, type: Date })
  updatedAt: Date;

  @Factory(() => tzCode[Math.floor(Math.random() * tzCode.length)])
  @Prop({ required: true })
  timeZone: string;

  @Factory(() => Math.floor(Math.random() * 8))
  @Prop({ required: true })
  count: number;
}

export const StreakSchema = SchemaFactory.createForClass(Streak).index({
  timeZone: 1,
  count: 1,
});
