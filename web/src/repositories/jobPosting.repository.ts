import JobPosting from '@/models/jobPosting.model';

const JobPostingRepository = {
  // To be deleted
  findById: async (id: string) => {
    return JobPosting.findById(id).lean();
  },
};

export default JobPostingRepository;
