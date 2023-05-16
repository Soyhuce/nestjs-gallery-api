import { Injectable } from '@nestjs/common';
import { Image } from './models';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel(Image.name)
    private readonly imageModel: Model<Image>,
  ) {}

  async create(
    file: Express.Multer.File,
    dto: { name: string },
  ): Promise<Image> {
    const newImage = new this.imageModel(dto);
    newImage.file = file.buffer;
    newImage.contentType = file.mimetype;
    return newImage.save();
  }

  async update(
    id: ObjectId,
    updatedFile?: Express.Multer.File,
    dto?: { name: string },
  ): Promise<Image> {
    if (updatedFile && dto) {
      return this.imageModel.findByIdAndUpdate(id, {
        file: updatedFile.buffer,
        contentType: updatedFile.mimetype,
        name: dto.name,
      });
    } else if (dto) {
      return this.imageModel.findByIdAndUpdate(id, {
        name: dto.name,
      });
    } else {
      return this.imageModel.findByIdAndUpdate(id, {
        file: updatedFile.buffer,
        contentType: updatedFile.mimetype,
      });
    }
  }

  async findAll(): Promise<Image[]> {
    return await this.imageModel.find().exec();
  }

  async getById(id): Promise<Image> {
    return await this.imageModel.findById(id).exec();
  }

  async removeImage(id): Promise<Image> {
    return this.imageModel.findByIdAndDelete(id);
  }
}
