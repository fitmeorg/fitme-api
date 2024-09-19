import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { GroupRepository } from './store/group.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from '@modules/token/token.module';
import { Group, GroupSchema } from './store/group.entity';
import { PaginationService } from '@modules/pagination/pagination.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('secretToken').secretToken,
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    TokenModule,
  ],
  controllers: [GroupController],
  providers: [GroupService, GroupRepository, PaginationService],
})
export class GroupModule {}
