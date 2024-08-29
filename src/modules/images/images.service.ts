import { BadRequestException, Injectable } from '@nestjs/common';
import { ImageRepository } from './store/image.repository';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as imageSize from 'image-size';
import { parseEntity } from '@common/util';

@Injectable()
export class ImagesService {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly configService: ConfigService,
  ) {}

  async create(file: Array<Express.Multer.File>) {
    const idImage = [];

    for (const image of file) {
      const { width, height } = await this.getImageDimensions(image);

      const fileDocument = await this.imageRepository.create({
        url: `${this.configService.get('HOST_API')}/images/${image.destination.substring(2)}/${image.filename}`,
        name: image.filename,
        size: image.size,
        format: image.mimetype,
        height,
        width,
      });

      idImage.push(fileDocument._id);
    }
    return idImage;
  }

  async remove(idImage: string, pathImage: string) {
    const image = await this.imageRepository.findByIdOrFail(idImage);

    const path = join(__dirname, `../../../${pathImage}`, image.name);

    if (!existsSync(path)) {
      throw new BadRequestException('no product found');
    }
    unlinkSync(path);

    await this.imageRepository.remove(parseEntity(image));

    return { message: 'File deleted successfully' };
  }

  async findImage(imageName: string, dest: string, res: Response) {
    const image = await this.imageRepository.findOneOrFail({
      name: imageName,
    });

    const path = join(__dirname, `../../../${dest}`, image.name.toString());

    res.sendFile(path);
  }

  async getImageDimensions(image: Express.Multer.File) {
    const dimensions = imageSize.imageSize(image.path);
    return { width: dimensions.width, height: dimensions.height };
  }
}
