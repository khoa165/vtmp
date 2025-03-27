import JobPosting from '@/models/jobPosting.model';

const JobPostingRepository = {
  findById: async (id: string) => {
    return JobPosting.findById(id).lean();
  },
};

export default JobPostingRepository;
