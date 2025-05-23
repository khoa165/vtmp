import { JobPostingRegion } from '@vtmp/common/constants';
import { JobPostingMetaData } from '@/services/link/validations';
export class ExtractMetadataService {
  static async extractMetadata(url: string): Promise<JobPostingMetaData> {
    return Promise.resolve({
      url: url,
      jobTitle: 'Software Engineer',
      companyName: 'Tech Company',
      location: JobPostingRegion.US,
      datePosted: '2023-10-01',
      jobDescription: 'Job description goes here.',
    });
  }
}
