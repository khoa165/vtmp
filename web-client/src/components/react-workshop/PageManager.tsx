import React from 'react';
import { useTodoListPage } from './todo-list-page-context';

interface IProps {
  hasNextPage: boolean;
}

export const PageManager: (props: IProps) => React.JSX.Element = ({
  hasNextPage,
}) => {
  const { page, goToPreviousPage, goToNextPage } = useTodoListPage();
  return (
    <div style={{ display: 'flex' }}>
      <button onClick={() => goToPreviousPage()} disabled={page === 1}>
        Previous
      </button>
      <button onClick={() => goToNextPage()} disabled={!hasNextPage}>
        Next
      </button>
      <p>Page: {page}</p>
    </div>
  );
};
