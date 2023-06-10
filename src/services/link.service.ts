import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Link, Prisma } from '@prisma/client';
import { CreateLinkDto } from '../dto/create.link.dto';
import { UpdateLinkDto } from '../dto/update.link.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';
import randomString from '../utils/randomString.util';
import * as qrcode from 'qrcode';

@Injectable()
export class LinkService {
  constructor(private prisma: PrismaService) {}

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.LinkWhereUniqueInput;
    where?: Prisma.LinkWhereInput;
    orderBy?: Prisma.LinkOrderByWithRelationInput;
  }): Promise<Link[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.link.findMany({ skip, take, cursor, where, orderBy });
  }

  async create(data: CreateLinkDto): Promise<Link> {
    let short_link = randomString({
        length: +process.env.SHORTLINK_LENGTH,
        alph: process.env.SHORTLINK_SYMBOLS,
        prefix: null,
      }),
      query = null;

    while (
      (query = await this.prisma.link.findFirst({ where: { short_link } }))
    ) {
      if (!query) break;

      short_link = randomString({
        length: 1,
        alph: process.env.SHORTLINK_SYMBOLS,
        prefix: short_link,
      });
    }

    data = {
      // owner: null, // Доделать при связи с auth
      short_link,
      link: data.link,
      created_at: new Date(),
      updated_at: new Date(),
      end_at: new Date(data.end_at),
    };

    return this.prisma.link.create({ data });
  }

  async redirect(
    where: Prisma.LinkWhereUniqueInput,
  ): Promise<URL | NotFoundException> {
    const link: Link = await this.prisma.link.findUnique({ where });

    if (!link) throw new NotFoundException('Invalid link');

    return new URL(link.link);
  }

  async findOne(where: Prisma.LinkWhereUniqueInput): Promise<Link> {
    const link: Link = await this.prisma.link.findUnique({ where });

    if (!link) throw new NotFoundException('Invalid link');

    return link;
  }

  async generateQR(
    where: Prisma.LinkWhereUniqueInput,
  ): Promise<Buffer | NotFoundException> {
    const link: Link = await this.prisma.link.findUnique({ where });

    if (!link) throw new NotFoundException('Invalid link');

    const image = (
      await qrcode.toDataURL(
        `https://${process.env.SERVER_HOSTNAME}/${link.short_link}`,
        { errorCorrectionLevel: 'H' },
      )
    ).replace('data:image/png;base64,', '');

    return Buffer.from(image, 'base64');
  }

  async update(params: {
    where: Prisma.LinkWhereUniqueInput;
    data: UpdateLinkDto;
  }): Promise<Link> {
    const { data, where } = params;

    if (data?.short_link) {
      const candidate = await this.prisma.link.findUnique({
        where: {
          short_link: data?.short_link,
        },
      });

      if (candidate && where.short_link != candidate.short_link) {
        throw new ConflictException('Such a short link already exists');
      }
    }

    return this.prisma.link.update({ data, where });
  }

  async delete(
    where: Prisma.LinkWhereUniqueInput,
  ): Promise<Link | NotFoundException> {
    const link: Link = await this.prisma.link.findUnique({ where });

    if (!link) throw new NotFoundException('Invalid link');

    return this.prisma.link.delete({ where });
  }
}
