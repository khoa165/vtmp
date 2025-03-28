import { Request, Response } from 'express';
import JobPostingService from '@/services/jobPosting.service';
import ResouceNotFoundError from '../utils/errors';
const JobPostingController = {
  updateJobPosting: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: 'ID is required' });
        return;
      }
      const newUpdate = req.body;
      const updatedJobPosting = await JobPostingService.updateById(
        id,
        newUpdate
      );
      res.status(200).json({
        data: updatedJobPosting,
        message: 'Job posting updated successfully',
      });
    } catch (error) {
      if (error instanceof ResouceNotFoundError) {
        res.status(error.metadata.status).json({ message: error.message });
      }
    }
    res.status(500).json({ message: 'An error occurred' });
  },
  deleteJobPosting: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: 'ID is required' });
        return;
      }
      const deletedJobPosting = await JobPostingService.deleteById(id);
      res.status(200).json({
        data: deletedJobPosting,
        message: 'Job posting deleted successfully',
      });
    } catch (error) {
      if (error instanceof ResouceNotFoundError) {
        res.status(error.metadata.status).json({ message: error.message });
      }
    }
    res.status(500).json({ message: 'An error occurred' });
  },
};

export default JobPostingController;
