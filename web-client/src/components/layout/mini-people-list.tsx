import React, { Fragment, useMemo } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { getAvatar, getName } from '@/utils/data';
import { Avatar } from '@/components/layout/avatar';
import { chunk } from 'remeda';

interface MiniPeopleListProps {
  peopleList: string[];
  prefix: string;
}
export const MiniPeopleList: React.FC<MiniPeopleListProps> = ({
  peopleList,
  prefix,
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
          <Avatar
            url={getAvatar(p)}
            id={`${prefix}-${p}`}
            alt={`Avatar of ${getName(p)}`}
            size="tiny"
          />
          <UncontrolledTooltip placement="bottom" target={`${prefix}-${p}`}>
            {getName(p)}
          </UncontrolledTooltip>
        </Fragment>
      ))}
    </div>
  ));
};
