import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ParseObjectIdPipe } from './pipes/parseObjectId.pipe';

const fileValidation = (fileIsRequired = true) =>
  new ParseFilePipe({
    fileIsRequired,
    validators: [
      new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }),
      new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
    ],
    exceptionFactory: (error) =>
      new HttpException(error, HttpStatus.BAD_REQUEST),
  });

@ApiTags('gallery')
@Controller('images')
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImage(
    @UploadedFile(fileValidation())
    file: Express.Multer.File,
    @Body() body: { name: string },
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const { contentType, createdAt, name, _id } =
      await this.imagesService.create(file, body);
    const host = req.get('host');
    const url = `http://${host}/images/${_id}`;
    return res.send({ contentType, createdAt, name, url, _id });
  }

  @Get('')
  async getImages(@Req() req) {
    const host = req.get('host');
    const images = await this.imagesService.findAll();
    return images.map(({ contentType, createdAt, name, _id }) => ({
      contentType,
      createdAt,
      name,
      _id,
      url: `http://${host}/images/${_id}`,
    }));
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'image id',
    schema: { type: 'string' },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async updateImage(
    @UploadedFile(fileValidation(false))
    file: Express.Multer.File,
    @Body() body: { name: string },
    @Res() res: Response,
    @Req() req: Request,
    @Param('id', ParseObjectIdPipe) id,
  ) {
    const { contentType, createdAt, name, _id } =
      await this.imagesService.update(id, file, body);
    const host = req.get('host');
    const url = `http://${host}/images/${_id}`;
    return res.send({ contentType, createdAt, name, url, _id });
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'image id',
    schema: { type: 'string' },
  })
  async getImage(@Res() res, @Param('id', ParseObjectIdPipe) id) {
    const image = await this.imagesService.getById(id);
    if (!image) {
      throw new NotFoundException('Image does not exist!');
    }
    const { file, contentType } = image;
    res.setHeader('Content-Type', contentType);
    return res.send(file);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'image id',
    schema: { type: 'string' },
  })
  async deleteImage(@Res() res, @Param('id', ParseObjectIdPipe) id) {
    const image = await this.imagesService.removeImage(id);
    if (!image) {
      throw new NotFoundException('Image does not exist!');
    }
    return res.status(HttpStatus.OK).json({ msg: 'Image removed.' });
  }
}
