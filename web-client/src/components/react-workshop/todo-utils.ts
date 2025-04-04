import { TodoTab } from './TabManager';
import { TTodoItem } from './types';

export const generateHardcodedItems = (): TTodoItem[] => [
  {
    _id: '1',
    description: 'Set up project repository',
    isCompleted: true,
    points: 3,
  },
  {
    _id: '2',
    description: 'Create initial component structure',
    isCompleted: false,
    points: 5,
  },
  {
    _id: '3',
    description: 'Implement authentication flow',
    isCompleted: false,
    points: 8,
  },
  {
    _id: '4',
    description: 'Write unit tests for components',
    isCompleted: false,
    points: 6,
  },
  {
    _id: '5',
    description: 'Update README with setup instructions',
    isCompleted: true,
    points: 2,
  },
  {
    _id: '6',
    description: 'Design database schema',
    isCompleted: true,
    points: 4,
  },
  {
    _id: '7',
    description: 'Integrate API endpoints',
    isCompleted: false,
    points: 7,
  },
  {
    _id: '8',
    description: 'Implement dark mode',
    isCompleted: false,
    points: 3,
  },
  {
    _id: '9',
    description: 'Fix responsive layout bugs',
    isCompleted: true,
    points: 4,
  },
  {
    _id: '10',
    description: 'Set up CI/CD pipeline',
    isCompleted: false,
    points: 5,
  },
];

// Slowed down function
export function filterTodos(todos: TTodoItem[], tab: TodoTab): TTodoItem[] {
  console.log(
    '[ARTIFICIALLY SLOW] Filtering ' +
      todos.length +
      ' todos for "' +
      tab +
      '" tab.'
  );

  // Simulate a slow operation
  // let startTime = performance.now();
  // while (performance.now() - startTime < 1000) {
  //   // Do nothing for 500 ms to emulate extremely slow code
  // }

  return todos.filter((todo) => {
    if (tab === TodoTab.ALL) {
      return true;
    } else if (tab === TodoTab.INCOMPLETE) {
      return !todo.isCompleted;
    } else if (tab === TodoTab.COMPLETE) {
      return todo.isCompleted;
    }
  });
}
