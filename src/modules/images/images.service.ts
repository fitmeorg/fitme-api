import { BadRequestException, Injectable } from '@nestjs/common';
import { ImageRepository } from './store/image.repository';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as imageSize from 'image-size';

@Injectable()
export class ImagesService {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly configService: ConfigService,
  ) {}

  async create(file: Express.Multer.File) {
    try {
      const { width, height } = await this.getImageDimensions(file);

      const fileDocument = await this.imageRepository.create({
        url: `${this.configService.get('HOST_API')}/images/${file.destination.substring(2)}/${file.filename}`,
        name: file.filename,
        size: file.size,
        format: file.mimetype,
        height,
        width,
      });
      return fileDocument;
    } catch (error) {}
  }

  async remove(idImage: string, pathImage: string) {
    try {
      const image = await this.imageRepository.findByIdOrFail(idImage);

      const path = join(__dirname, `../../../${pathImage}`, image.name);

      if (!existsSync(path)) {
        throw new BadRequestException('no product found');
      }
      unlinkSync(path);

      await this.imageRepository.remove(image._id.toString());

      return { message: 'File deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Error deleting the file');
    }
  }

  async findImage(imageName: string, dest: string, res: Response) {
    try {
      const image = await this.imageRepository.findOneOrFail({
        name: imageName,
      });

      const path = join(__dirname, `../../../${dest}`, image.name.toString());

      res.sendFile(path);
    } catch (error) {
      return error;
    }
  }

  async getImageDimensions(image: Express.Multer.File) {
    try {
      const dimensions = imageSize.imageSize(image.path);
      return { width: dimensions.width, height: dimensions.height };
    } catch (error) {
      throw new Error('Could not get image dimensions');
    }
  }
}
