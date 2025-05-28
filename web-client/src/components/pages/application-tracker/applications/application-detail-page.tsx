import React from 'react';
import { InterviewCard } from './interview-card';
import { InterviewDrawer } from './interview-drawer';

export const ApplicationDetailPage = () => {
  return (
    <div className="w-full h-full p-10">
      <h1 className="text-2xl font-bold mb-4">Application Detail Page</h1>
      <p>This page will display the details of a specific application.</p>

      <InterviewCard />
      <InterviewDrawer />
    </div>
  );
};
