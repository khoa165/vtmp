import React, { useState, ReactNode, useCallback, useMemo } from 'react';

interface IToDoListPageContext {
  page: number;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
}

const DefaultToDoListPageContext: IToDoListPageContext = {
  page: 1,
  goToPreviousPage: () => {},
  goToNextPage: () => {},
};
export const TodoListPageContext = React.createContext<IToDoListPageContext>(
  DefaultToDoListPageContext
);

export const useTodoListPage = (): IToDoListPageContext => {
  const context = React.useContext(TodoListPageContext);
  if (!context) {
    throw new Error(
      'useTodoListPage must be used within a TodoListPageContextProvider'
    );
  }
  return context;
};

export const TodoListPageContextProvider = ({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element => {
  const [page, setPage] = useState(1);

  const goToPreviousPage = useCallback(() => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  }, [setPage]);

  const goToNextPage = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, [setPage]);

  const contextValue = useMemo(() => {
    return { page, goToPreviousPage, goToNextPage };
  }, [page, goToPreviousPage, goToNextPage]);

  return (
    <TodoListPageContext.Provider value={contextValue}>
      {children}
    </TodoListPageContext.Provider>
  );
};
