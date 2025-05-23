import { JobPostingMetaData } from '@/services/link/validations';
/* eslint-disable @typescript-eslint/no-extraneous-class */
export class LinkDeduplicatorService {
  static async checkDuplicate(metadata: JobPostingMetaData): Promise<void> {
    console.log(metadata);
  }
}
