import React, { Fragment } from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import { getAvatar, getName } from 'src/utils/data';
import { Avatar } from 'src/components/layout/avatar';

interface MiniPeopleListProps {
  peopleList: string[];
  prefix: string;
}
export const MiniPeopleList: React.FC<MiniPeopleListProps> = ({
  peopleList,
  prefix,
}) => {
  return peopleList.map((p) => (
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
  ));
};
