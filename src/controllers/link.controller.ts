import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Response,
} from '@nestjs/common';
import { LinkService } from '../services/link.service';
import { Link } from '@prisma/client';
import { CreateLinkDto } from '../dto/create.link.dto';
import { UpdateLinkDto } from '../dto/update.link.dto';

@Controller()
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Get('/links')
  findAll() {
    return this.linkService.findMany({});
  }

  @Post('/links')
  create(
    @Body()
    data: CreateLinkDto,
  ): Promise<Link> {
    return this.linkService.create(data);
  }

  @Get('/:short_link')
  async redirect(
    @Response() response,
    @Param('short_link') short_link: string,
  ) {
    const link = await this.linkService.redirect({ short_link });

    if (link instanceof URL) {
      return response.redirect(HttpStatus.PERMANENT_REDIRECT, link);
    }
  }

  @Get('/@:short_link')
  findOne(@Param('short_link') short_link: string) {
    return this.linkService.findOne({ short_link });
  }

  @Get('/:short_link/qr')
  async generateQR(
    @Response() response,
    @Param('short_link') short_link: string,
  ) {
    const qr = await this.linkService.generateQR({ short_link });

    if (qr instanceof Buffer) {
      return response.header('Content-Type', 'image/png').send(qr);
    }
  }

  @Patch('/:short_link')
  update(
    @Param('short_link') short_link: string,
    @Body() updateLinkDto: UpdateLinkDto,
  ) {
    return this.linkService.update({
      where: { short_link },
      data: updateLinkDto,
    });
  }

  @Delete('/:short_link')
  delete(@Param('short_link') short_link: string) {
    return this.linkService.delete({ short_link });
  }
}
