import { Router } from 'express';
import { JobPostingController } from '@/controllers/job-posting.controller';
const JobPostingRoutes = Router();

JobPostingRoutes.put('/:jobId', JobPostingController.updateJobPosting);
JobPostingRoutes.delete('/:jobId', JobPostingController.deleteJobPosting);

export default JobPostingRoutes;
