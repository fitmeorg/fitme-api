import { Module } from '@nestjs/common';
import { ClusterService } from './cluster.service';
import { ClusterController } from './cluster.controller';
import { ClusterRepository } from './store/cluster.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from '@modules/token/token.module';
import { Cluster, ClusterSchema } from './store/cluster.entity';
import { PaginationService } from '@modules/pagination/pagination.service';
import { ImagesService } from '@modules/images/images.service';
import { ImagesModule } from '@modules/images/images.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cluster.name, schema: ClusterSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('secretToken').secretToken,
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    TokenModule,
    ImagesModule,
  ],
  controllers: [ClusterController],
  providers: [
    ClusterService,
    ClusterRepository,
    PaginationService,
    ImagesService,
  ],
})
export class ClusterModule {}
