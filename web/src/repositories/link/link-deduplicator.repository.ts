import { LinkModel, ILink } from '@/models/link.model';

export class LinkDeduplicatorRepo {
  static async findLinkByUrl(url: string): Promise<ILink | null> {
    return LinkModel.findOne({ where: { url } }).lean();
  }
}
