import React, { Fragment, useMemo } from 'react';
import { chunk } from 'remeda';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '#vtmp/web-client/components/base/tooltip';
import { Avatar } from '#vtmp/web-client/components/layout/avatar';
import { getAvatar, getName } from '#vtmp/web-client/utils/data';

interface MiniPeopleListProps {
  peopleList: string[];
}
export const MiniPeopleList: React.FC<MiniPeopleListProps> = ({
  peopleList,
}) => {
  const cols = useMemo(() => {
    if (peopleList.length <= 3) {
      return peopleList.length;
    }
    if (peopleList.length <= 6) {
      return Math.ceil(peopleList.length / 2);
    }
    return 3;
  }, [peopleList.length]);
  return chunk(peopleList, cols).map((pl, index) => (
    <div key={index} className="flex justify-end gap-x-2">
      {pl.map((p) => (
        <Fragment key={p}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Avatar
                    url={getAvatar(p)}
                    alt={`Avatar of ${getName(p)}`}
                    size="tiny"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">{getName(p)}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Fragment>
      ))}
    </div>
  ));
};
