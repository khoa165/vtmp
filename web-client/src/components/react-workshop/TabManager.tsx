import React from 'react';

interface IProps {
  setTab: (tab: TodoTab) => void;
}

export enum TodoTab {
  ALL = 'ALL',
  COMPLETE = 'COMPLETE',
  INCOMPLETE = 'INCOMPLETE',
}

export const TabManager: (props: IProps) => React.JSX.Element = ({
  setTab,
}) => {
  return (
    <div style={{ display: 'flex' }}>
      <button onClick={() => setTab(TodoTab.ALL)}>All</button>
      <button onClick={() => setTab(TodoTab.COMPLETE)}>Completed</button>
      <button onClick={() => setTab(TodoTab.INCOMPLETE)}>Incomplete</button>
    </div>
  );
};
