import { Prisma } from '@prisma/client';
import { IsEmpty, IsNotEmpty } from 'class-validator';

export class CreateLinkDto implements Prisma.LinkCreateInput {
  // @IsEmpty()
  // owner: string;

  @IsEmpty()
  short_link: string;

  @IsNotEmpty()
  link: string;

  @IsEmpty()
  created_at: Date | null;

  @IsEmpty()
  updated_at: Date | null;

  @IsNotEmpty()
  end_at: Date;
}
