import React, { useCallback, useState } from 'react';
import { TTodoItem } from './types';
import 'styles/scss/todo.scss';
import { MarkAsDoneButton } from './MarkAsDoneButton';
import { ErrorBoundary } from 'react-error-boundary';
import { ChangingColorText } from './ChangingColorText';

interface IProps {
  todoItem: TTodoItem;
  order: number;
}

export const TodoItemCard: (props: IProps) => React.JSX.Element = ({
  todoItem,
  order,
}) => {
  const { description, _id: itemId, isCompleted } = todoItem;

  // throw new Error('Error in TodoItemCard');

  return (
    <div
      className="todoItemCard"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <ChangingColorText />
      {description}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <ErrorBoundary fallback={<div>Broken button</div>}>
          {isCompleted ? 'Done' : <MarkAsDoneButton itemId={itemId} />}
        </ErrorBoundary>
      </div>
    </div>
  );
};
