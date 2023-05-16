import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type ImageDocument = HydratedDocument<Image>;

@Schema()
export class Image {
  readonly _id: ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  file: Buffer;

  @Prop({ default: null })
  contentType: string;

  @Prop({ default: Date.now() })
  createdAt: Date;
  url: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
