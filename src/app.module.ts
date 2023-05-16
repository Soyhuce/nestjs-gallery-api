import { Module } from '@nestjs/common';
import { GalleryModule } from './gallery';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    GalleryModule,
    MongooseModule.forRoot('mongodb://localhost:27017/gallery_api'),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
