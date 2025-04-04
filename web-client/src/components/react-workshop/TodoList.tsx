import { useContext, useMemo } from 'react';

import { TTodoItem } from './types';
import { filterTodos } from './todo-utils';
import { TodoTab } from './TabManager';
import { WorkshopTheme } from './ReactWorkshop';
import { MemoizedTodoItemList, TodoItemList } from './TodoItemList';

interface IProps {
  todos: TTodoItem[];
  tab: TodoTab;
  // theme: WorkshopTheme;
  flickeringText: string;
}

export default function TodoList({ todos, tab, flickeringText }: IProps) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);

  // const visibleTodos = filterTodos(todos, tab);

  return (
    <div>
      <h3>Current text: {flickeringText}</h3>
      {/* <TodoItemList visibleTodos={visibleTodos} /> */}
      <MemoizedTodoItemList visibleTodos={visibleTodos} />
    </div>
  );
}
