import { Module } from '@nestjs/common';
import { LinkService } from '../services/link.service';
import { LinkController } from '../controllers/link.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [LinkController],
  providers: [LinkService, PrismaService],
})
export class LinkModule {}
