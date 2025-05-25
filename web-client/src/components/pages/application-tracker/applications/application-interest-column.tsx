import React from 'react';
import { InterestLevel } from '@vtmp/common/constants';
import { ChevronsUp, ChevronsDown, ChevronUp } from 'lucide-react';

interface ApplicationInterestColumnProps {
  interest: InterestLevel;
}

const getInterestIcon = (interest: InterestLevel) => {
  switch (interest) {
    case InterestLevel.LOW:
      return <ChevronsDown />;
    case InterestLevel.MEDIUM:
      return <ChevronUp />;
    case InterestLevel.HIGH:
      return <ChevronsUp />;
    default:
      return <ChevronsUp />;
  }
};

export const ApplicationInterestColumn = ({
  interest,
}: ApplicationInterestColumnProps) => {
  const interestIcon = getInterestIcon(interest);
  return <div className="flex items-center gap-2">{interestIcon}</div>;
};
