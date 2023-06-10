import { Prisma } from '@prisma/client';
import { IsEmpty } from 'class-validator';

export class UpdateLinkDto implements Prisma.LinkUpdateInput {
  // @IsEmpty()
  // owner: string;

  short_link: string;
  link: string;

  @IsEmpty()
  created_at: Date | null;

  @IsEmpty()
  updated_at: Date | null;

  end_at: Date;
}
