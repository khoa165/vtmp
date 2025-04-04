import React, {
  useState,
  useCallback,
  ChangeEvent,
  createContext,
} from 'react';
import { TabManager, TodoTab } from './TabManager';
import { generateHardcodedItems } from './todo-utils';
import TodoList from './TodoList';
import { Flicker, MemoizedFlicker } from './Flicker';
import { useTodoItems } from './hooks';
import { TodoListPageContextProvider } from './todo-list-page-context';
import TodoListFromDB from './TodoListFromDB';
import { PageManager } from './PageManager';
import { TextColorContextProvider } from './text-color-context';

export enum WorkshopTheme {
  LIGHT = 'light',
  DARK = 'dark',
}

const defaultTodos = generateHardcodedItems();

export const ReactWorkshop = () => {
  const [tab, setTab] = React.useState(TodoTab.ALL);
  const [flickeringText, setFlickeringText] = useState('KHOA');

  // const [theme, setTheme] = React.useState(WorkshopTheme.DARK);
  // const updateTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setTheme(e.target.checked ? WorkshopTheme.DARK : WorkshopTheme.LIGHT);
  // };

  // const doFlicker = (e: ChangeEvent<HTMLInputElement>) => {
  //   setFlickeringText(e.target.checked ? 'KHOA' : 'ANH');
  // };

  // const doFlickerWithCache = useCallback(
  //   (e: ChangeEvent<HTMLInputElement>) => {
  //     setFlickeringText(e.target.checked ? 'KHOA' : 'ANH');
  //   },
  //   [setFlickeringText]
  // );

  return (
    // <TodoListPageContextProvider>
    // SomeComponent
    <TextColorContextProvider>
      <div
        id="react-workshop-page"
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <MemoizedFlicker />
        <TabManager setTab={setTab} />
        {/* <TodoList todos={defaultTodos} tab={tab} flickeringText={textColor} /> */}
        <TodoListFromDB tab={tab} flickeringText={flickeringText} />
      </div>
    </TextColorContextProvider>
  );
};
