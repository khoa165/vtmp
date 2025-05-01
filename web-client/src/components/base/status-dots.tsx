import React from 'react';

const SubmittedStatusDot = () => {
  return (
    <div className="w-[1rem] h-[1rem] rounded-full bg-[#A2BFF0] max-lg:w-[0.7rem] max-lg:h-[0.7rem]"></div>
  );
};

const OAStatusDot = () => {
  return (
    <div className="w-[1rem] h-[1rem] rounded-full bg-[#F49DFF] max-lg:w-[0.7rem] max-lg:h-[0.7rem]"></div>
  );
};
const InterviewingStatusDot = () => {
  return (
    <div className="w-[1rem] h-[1rem] rounded-full bg-[#F8FF6A] max-lg:w-[0.7rem] max-lg:h-[0.7rem]"></div>
  );
};
const OfferedStatusDot = () => {
  return (
    <div className="w-[1rem] h-[1rem] rounded-full bg-[#A3F890] max-lg:w-[0.7rem] max-lg:h-[0.7rem]"></div>
  );
};
const RejectedStatusDot = () => {
  return (
    <div className="w-[1rem] h-[1rem] rounded-full bg-[#FEB584] max-lg:w-[0.7rem] max-lg:h-[0.7rem]"></div>
  );
};
const WithdrawnStatusDot = () => {
  return (
    <div className="w-[1rem] h-[1rem] rounded-full bg-[#CAAB94] max-lg:w-[0.7rem] max-lg:h-[0.7rem]"></div>
  );
};

export {
  SubmittedStatusDot,
  OAStatusDot,
  InterviewingStatusDot,
  OfferedStatusDot,
  RejectedStatusDot,
  WithdrawnStatusDot,
};
