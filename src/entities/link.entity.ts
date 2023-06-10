import { Link as LinkModel } from '@prisma/client';

export class Link implements LinkModel {
  id: string;
  // owner: string;
  short_link: string;
  link: string;
  created_at: Date | null;
  updated_at: Date | null;
  end_at: Date;
}
