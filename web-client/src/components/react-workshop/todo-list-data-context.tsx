// import { TTodoItem } from "./types";

// interface ITodoListDataContext {
//   todoItems: TTodoItem[];

// }

// export const TodoListDataContextProvider = ({children}: {children: React.ReactNode}) => {

//   const [todos, setTodos] = React.useState<string[]>([]);

//   const addTodo = (todo: string) => {
//     setTodos((prevTodos) => [...prevTodos, todo]);
//   };

//   const removeTodo = (index: number) => {
//     setTodos((prevTodos) => prevTodos.filter((_, i) => i !== index));
//   };

//   return (
//     <TodoListDataContext.Provider value={{ todos, addTodo, removeTodo }}>
//       {children}
//     </TodoListDataContext.Provider>
//   );
// }
