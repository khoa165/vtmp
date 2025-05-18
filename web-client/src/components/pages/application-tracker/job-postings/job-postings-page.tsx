import { JobPostingsContainer } from '@/components/pages/application-tracker/job-postings/job-postings-container';
import { JobPostingStatusCards } from '@/components/pages/application-tracker/job-postings/job-postings-status';
import React from 'react';

export const JobPostingsPage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-foreground">Welcome back, {}.</h1>
      <JobPostingStatusCards />
      <JobPostingsContainer />
    </div>
  );
};
