import { Router } from 'express';
import { LinkController } from '@/controllers/link.controller';

const LinkRoutes = Router();

LinkRoutes.post('/', LinkController.submitLink);
LinkRoutes.get('/', LinkController.getPendingLinks);
LinkRoutes.post('/:linkId/approve', LinkController.approveLink);
LinkRoutes.post('/:linkId/reject', LinkController.rejectLink);

export default LinkRoutes;
