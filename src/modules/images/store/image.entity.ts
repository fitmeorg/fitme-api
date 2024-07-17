import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ImageDocument = HydratedDocument<Image>;

@Schema()
export class Image {
  @Prop({ required: false, unique: true })
  url: string;

  @Prop()
  name: string;

  @Prop({ required: false })
  create_by?: string;

  @Prop({ required: false })
  thumbnail_url?: string;

  @Prop()
  size: number;

  @Prop()
  format: string;

  @Prop()
  height: number;

  @Prop()
  width: number;

  @Prop({ default: Date.now() })
  create_at: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
