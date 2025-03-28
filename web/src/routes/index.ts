import { Router } from 'express';
import UserRoutes from '@/routes/user.routes';
import InvitationRoutes from '@/routes/invitation.routes';
import ApplicationRoutes from '@/routes/application.routes';
import InterviewRoutes from '@/routes/interview.routes';
import JobPostingRoutes from '@/routes/jobPosting.routes';
import LinkRoutes from '@/routes/link.routes';
import AuthenticationRoutes from './auth.routes';

const router = Router();

router.use('/users', UserRoutes); // User module
router.use('/invitations', InvitationRoutes); // Invitation module
router.use('/applications', ApplicationRoutes); // Application module
router.use('/interviews', InterviewRoutes); // Interview module
router.use('/job-postings', JobPostingRoutes); // Job Posting module
router.use('/links', LinkRoutes); // Link module
router.use('/auth', AuthenticationRoutes); // Authentication module

export default router;
