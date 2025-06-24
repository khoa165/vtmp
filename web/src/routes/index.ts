import { Router } from 'express';
import { UserRoutes } from '@/routes/user.routes';
import { InvitationRoutes } from '@/routes/invitation.routes';
import { ApplicationRoutes } from '@/routes/application.routes';
import { InterviewRoutes } from '@/routes/interview.routes';
import { JobPostingRoutes } from '@/routes/job-posting.routes';
import { LinkRoutes } from '@/routes/link.routes';
import { AuthRoutes } from '@/routes/auth.routes';
import { VisualizationRoutes } from '@/routes/visualization.routes';

const router = Router();

router.use('/users', UserRoutes);
router.use('/invitations', InvitationRoutes);
router.use('/applications', ApplicationRoutes);
router.use('/interviews', InterviewRoutes);
router.use('/job-postings', JobPostingRoutes);
router.use('/links', LinkRoutes);
router.use('/auth', AuthRoutes);
router.use('/visualization', VisualizationRoutes);

export default router;
