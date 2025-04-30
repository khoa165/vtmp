import React from 'react';

export const ApplicationCard = (props) => {
  const { jobPostingId, userId, status } = props;
  return (
    <div>
      <div>Job posting Id: {jobPostingId}</div>
      <div>User Id: {userId}</div>
      <div>Status: {status}</div>
    </div>
  );
};
