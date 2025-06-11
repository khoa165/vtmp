import { LinkRepository } from '@/repositories/link.repository';
import { LinkProcessStage, LinkStatus } from '@vtmp/common/constants';
import { EnvConfig } from '@/config/env';
import cron from 'node-cron';
import axios from 'axios';
const api = axios.create({
  baseURL: `${EnvConfig.get().LINK_PROCESSING_DOMAIN}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

cron.schedule('0 0 * * * *', async () => {
  const links = await LinkRepository.getLinks({
    status: LinkStatus.PENDING,
    processStage: LinkProcessStage.NOT_PROCESSED,
  });
  links.forEach(async (link) => {
    await api.request({
      method: 'POST',
      url: '/link',
      data: {
        url: link.url,
        id: link.id,
      },
    });
  });
});
