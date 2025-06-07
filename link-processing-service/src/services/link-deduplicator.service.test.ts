// import { expect } from 'chai';
// import { useMongoDB } from '@/testutils/mongoDB.testutil';
// import { LinkRepository } from '@/repositories/link.repository';
// import { ILink } from '@/models/link.model';
// import { LinkDeduplicatorService } from '@/services/link-deduplicator.service';
// import { DuplicateResourceError } from '@/utils/errors';

// describe('LinkDeduplicatorService', () => {
//   useMongoDB();

//   describe('checkDuplicate', () => {
//     it('should throw error when link already exists', async () => {
//       const mockLinkData = {
//         url: 'google.com',
//         jobTitle: 'Software Engineer',
//         companyName: 'Example Company',
//       };
//       const googleLink: ILink = await LinkRepository.createLink(mockLinkData);
//       const newLink = {
//         url: googleLink.url,
//         jobTitle: 'Software Engineer',
//         companyName: 'Example Company',
//       };

//       await expect(
//         LinkDeduplicatorService.checkDuplicate(newLink.url)
//       ).to.be.rejectedWith(DuplicateResourceError);
//     });

//     it('should not throw error when link does not exist', async () => {
//       await expect(
//         LinkDeduplicatorService.checkDuplicate('nonexistent.com')
//       ).to.not.be.rejectedWith(DuplicateResourceError);
//     });
//   });
// });
