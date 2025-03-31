import * as chai from 'chai';
import chaiSubset from 'chai-subset';
import { LinkStatus } from '@/models/link.model';
import { differenceInSeconds } from 'date-fns';

import LinkRepository from '@/repositories/link.repository';
import { useMongoDB } from '@/config/mongodb.testutils';

chai.use(chaiSubset);
const { expect } = chai;
describe.only('LinkRepository', () => {
  useMongoDB();

  it('getLinkById should be able to find link by id', async () => {
    const googleLink = await LinkRepository.createLink('google.com');
    const link = await LinkRepository.getLinkById(googleLink.id);

    expect(link).to.not.be.null;
  });

  it('createLink should be able to create new link with expected fields', async () => {
    const URL = 'google.com';
    const link = await LinkRepository.createLink(URL);
    const timeDiff = differenceInSeconds(new Date(), link.submittedOn);

    expect(link.url).to.equal(URL);
    expect(link.status).to.equal(LinkStatus.PENDING);
    expect(timeDiff).to.lessThan(3);
  });

  it('updateStatus should be able to update link status', async () => {
    const googleLink = await LinkRepository.createLink('google.com');
    const link = await LinkRepository.updateStatus({
      id: googleLink.id,
      status: LinkStatus.APPROVED,
    });

    expect(link).to.not.be.null;
    expect(link?.status).to.equal(LinkStatus.APPROVED);
  });

  it('getLinksByStatus should be able to get one link by status', async () => {
    await LinkRepository.createLink('google.com');
    const links = await LinkRepository.getLinksByStatus(LinkStatus.PENDING);

    expect(links).to.have.lengthOf(1);
  });

  it('getLinksByStatus should be able to get multiple links by status', async () => {
    await LinkRepository.createLink('google.com');
    await LinkRepository.createLink('nvidia.com');
    const links = await LinkRepository.getLinksByStatus(LinkStatus.PENDING);

    expect(links).to.have.lengthOf(2);
  });

  it('getLinksByStatus should not include link of different status', async () => {
    const googleLink = await LinkRepository.createLink('google.com');
    await LinkRepository.createLink('nvidia.com');
    await LinkRepository.createLink('microsoft.com');

    const beforeUpdateLink = await LinkRepository.getLinksByStatus(
      LinkStatus.PENDING
    );
    expect(beforeUpdateLink).to.have.lengthOf(3);

    await LinkRepository.updateStatus({
      id: googleLink.id,
      status: LinkStatus.APPROVED,
    });
    const afterUpdateLink = await LinkRepository.getLinksByStatus(
      LinkStatus.PENDING
    );
    expect(afterUpdateLink).to.have.lengthOf(2);
  });
});
