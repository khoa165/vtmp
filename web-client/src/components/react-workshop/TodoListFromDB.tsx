import { useContext, useMemo } from 'react';

import { TTodoItem } from './types';
import { filterTodos } from './todo-utils';
import { TodoItemCard } from './TodoItemCard';
import { TodoTab } from './TabManager';
import { WorkshopTheme } from './ReactWorkshop';
import { TodoItemList } from './TodoItemList';
import { useTodoItems } from './hooks';
import { useTodoListPage } from './todo-list-page-context';
import { PageManager } from './PageManager';
import { ErrorBoundary } from 'react-error-boundary';

interface IProps {
  tab: TodoTab;
  flickeringText: string;
}

export default function TodoListFromDB({ tab, flickeringText }: IProps) {
  const { page } = useTodoListPage();
  const { items, loading, error } = useTodoItems({ page });

  const visibleTodos = useMemo(
    () => filterTodos(items ?? [], tab),
    [items, tab]
  );

  if (error) {
    throw error;
  }

  if (loading || items == null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Current text: {flickeringText}</h3>
      <ErrorBoundary fallback={<div>Something went really wrong</div>}>
        <TodoItemList visibleTodos={visibleTodos} />
      </ErrorBoundary>

      <PageManager hasNextPage={true} />
    </div>
  );
}
