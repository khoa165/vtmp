import React from 'react';
import { useGate } from 'statsig-react';

export const ProjectsContainer = () => {
  const { value: showMentorshipProjects, isLoading } = useGate(
    'show_experimental_features'
  );

  if (isLoading) {
    return (
      <h1 className="text-center text-white mt-5">
        Page is loading, wait a moment!
      </h1>
    );
  }

  if (!showMentorshipProjects) {
    return (
      <h1 className="text-center text-white mt-5">
        Page is under development, stay tuned!
      </h1>
    );
  }

  return <h1 className="text-center text-white mt-5">Something fun</h1>;
};
