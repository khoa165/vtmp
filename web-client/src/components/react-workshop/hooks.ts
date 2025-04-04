import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TodoItem, TodoItems, TTodoItem, User } from './types';
import { useState } from 'react';

interface IItemHookProps {
  page: number;
}

interface IItemHookReturn {
  items: TTodoItem[] | undefined;
  loading: boolean;
  error: Error | null;
}

interface IUserHookProps {
  userId: string;
}

interface IUserHookReturn {
  hasUser: boolean;
  user: any;
  loading: boolean;
  error: Error | null;
}

const delay = (seconds: number) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

export const GENERIC_TODO_ITEMS_CACHE_KEY = 'todoItems';

export const useTodoItems = ({ page }: IItemHookProps): IItemHookReturn => {
  const fetchItems = async () => {
    const params = new URLSearchParams({
      page: page.toString(),
    });
    const response = await fetch(
      `http://localhost:8000/api/todos/get?${params.toString()}`
    );
    const jsonizedResponse = await response.json();
    return TodoItems.parse(jsonizedResponse.data);
  };

  const {
    data: todoItems,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      GENERIC_TODO_ITEMS_CACHE_KEY,
      {
        page,
      },
    ],
    queryFn: fetchItems,
  });

  return {
    items: todoItems,
    loading: isLoading,
    error,
  };
};

export const useUser = ({ userId }: IUserHookProps) => {
  const fetchUser = async () => {
    const params = new URLSearchParams({
      userId,
    });
    const response = await fetch(
      `http://localhost:8000/api/users/getSingle?${params.toString()}`
    );
    const jsonizedResponse = await response.json();
    return User.parse(jsonizedResponse.data);
  };
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: fetchUser,
  });

  return {
    user,
    loading: isLoading,
    error,
  };
};
