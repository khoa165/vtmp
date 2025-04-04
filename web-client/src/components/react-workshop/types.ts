import { z as zod } from 'zod';

export const TodoItem = zod.object({
  _id: zod.string(),
  description: zod.string(),
  isCompleted: zod.boolean(),
  points: zod.number(), // do not care
  assignedTo: zod.string().optional(), // do not care
});

export const User = zod.object({
  name: zod.string(),
  email: zod.string(),
  password: zod.string(),
});

export const TodoItems = zod.array(TodoItem);

export type TTodoItem = zod.infer<typeof TodoItem>;

export type TUser = zod.infer<typeof User>;
