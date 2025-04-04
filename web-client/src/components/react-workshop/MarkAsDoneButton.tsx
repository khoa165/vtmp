import React, { useCallback } from 'react';
import { useTodoListPage } from './todo-list-page-context';
import { TodoItem } from './types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GENERIC_TODO_ITEMS_CACHE_KEY } from './hooks';
import { BadMutationError } from './errors/canonical-errors';

interface IProps {
  itemId: string;
}

export const MarkAsDoneButton: (props: IProps) => React.JSX.Element = ({
  itemId,
}) => {
  const queryClient = useQueryClient();
  const { page } = useTodoListPage();

  const markAsDone = async ({ itemId }: { itemId: string }) => {
    const params = new URLSearchParams({
      itemId,
    });

    const response = await fetch(
      `http://localhost:8000/api/todos/markDone/?${params.toString()}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const jsonizedResponse = await response.json();

    throw new BadMutationError(
      'Dev should see',
      {
        itemId,
      },
      'Users should see'
    );

    return TodoItem.parse(jsonizedResponse.data);
  };

  const { mutate } = useMutation({
    mutationFn: markAsDone,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [GENERIC_TODO_ITEMS_CACHE_KEY, { page }],
      });
    },
    onError: (error) => {
      throw error;
    },
  });

  return <button onClick={() => void mutate({ itemId })}>Mark done</button>;
};
