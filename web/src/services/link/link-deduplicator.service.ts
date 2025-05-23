import { JobPostingMetaData } from '@/services/link/validations';
export class LinkDeduplicatorService {
  static async checkDuplicate(metadata: JobPostingMetaData): Promise<void> {
    console.log(metadata);
  }
}
