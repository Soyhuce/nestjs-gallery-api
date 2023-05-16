import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { Image, ImageSchema } from './models';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService],
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
    MulterModule,
  ],
})
export class GalleryModule {}
