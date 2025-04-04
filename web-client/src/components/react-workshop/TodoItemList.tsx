import React, { Fragment, useEffect, memo } from 'react';
import { TTodoItem } from './types';
import { TodoItemCard } from './TodoItemCard';
import { ErrorBoundary } from 'react-error-boundary';

interface IProps {
  visibleTodos: TTodoItem[];
}

function expensiveComputation() {
  const start = performance.now();
  let lastLoggedSecond = 0;

  while (performance.now() - start < 5000) {
    const elapsed = Math.floor((performance.now() - start) / 1000);
    if (elapsed > lastLoggedSecond) {
      lastLoggedSecond = elapsed;
      console.log(`🕒 ${elapsed} second(s) passed...`);
    }
  }

  return '✅ Expensive UI rendered';
}

export const TodoItemList: (props: IProps) => React.JSX.Element = ({
  visibleTodos,
}) => {
  // console.log('My name is TodoItemList and I am rendered.');

  // const result = expensiveComputation();

  return (
    <Fragment>
      {/* <h1>{result}</h1> */}
      <ul style={{ listStyle: 'none' }}>
        {visibleTodos.map((todo, key) => (
          <li key={todo._id}>
            <TodoItemCard todoItem={todo} order={key} />
          </li>
        ))}
      </ul>
    </Fragment>
  );
};

export const MemoizedTodoItemList = memo(TodoItemList);
