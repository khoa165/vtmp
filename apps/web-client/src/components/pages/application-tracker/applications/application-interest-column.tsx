import { ChevronsUp, ChevronsDown, ChevronUp } from 'lucide-react';

import { InterestLevel } from '@vtmp/common/constants';

interface ApplicationInterestColumnProps {
  interest: InterestLevel;
}

type ChevronIcon = typeof ChevronsUp | typeof ChevronsDown | typeof ChevronUp;
const InterestLevelToIconMapping: Record<InterestLevel, ChevronIcon> = {
  [InterestLevel.HIGH]: ChevronsUp,
  [InterestLevel.MEDIUM]: ChevronUp,
  [InterestLevel.LOW]: ChevronsDown,
};

const InterestLevelToColorMapping: Record<InterestLevel, string> = {
  [InterestLevel.HIGH]: 'text-vtmp-orange',
  [InterestLevel.MEDIUM]: 'text-vtmp-yellow',
  [InterestLevel.LOW]: 'text-vtmp-blue',
};

export const ApplicationInterestColumn = ({
  interest,
}: ApplicationInterestColumnProps) => {
  const InterestIcon = InterestLevelToIconMapping[interest];
  return (
    <div className="flex items-center gap-2">
      <InterestIcon
        className={`w-8 h-8 ${InterestLevelToColorMapping[interest]}`}
      />
    </div>
  );
};

export const ApplicationInterestDropDown = ({
  interest,
}: {
  interest: InterestLevel;
}) => {
  const InterestIcon = InterestLevelToIconMapping[interest];
  return (
    <span className="flex items-center gap-2">
      <InterestIcon
        className={`w-8 h-8 ${InterestLevelToColorMapping[interest]}`}
      />
      <span>{interest}</span>
    </span>
  );
};
