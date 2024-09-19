import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ImageDocument = HydratedDocument<Image>;

@Schema()
export class Image {
  @Prop({ unique: true })
  url: string;

  @Prop()
  name: string;

  @Prop()
  createBy?: string;

  @Prop()
  thumbnailUrl?: string;

  @Prop()
  size: number;

  @Prop()
  format: string;

  @Prop()
  height: number;

  @Prop()
  width: number;

  @Prop({ default: Date.now() })
  createAt: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
