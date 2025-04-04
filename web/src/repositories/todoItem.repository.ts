import TodoItem, { TodoItemDocument } from '@/models/todoItem.model';

const TodoItemRepository = {
  create: async (itemData: TodoItemDocument) => {
    const item = new TodoItem(itemData);
    await item.save();
    return item;
  },

  getAll: async (sortedByTime: 1 | -1): Promise<TodoItemDocument[]> => {
    return TodoItem.find().sort({ createdAt: sortedByTime }).lean();
  },

  writePoints: async ({
    itemId,
    points,
  }: {
    itemId: string;
    points: number;
  }): Promise<TodoItemDocument> => {
    const updatedItem = await TodoItem.findByIdAndUpdate(
      itemId,
      { points },
      { new: true }
    ).lean();
    if (updatedItem == null) {
      throw new Error('Failed to update points');
    }
    return updatedItem;
  },

  assign: async ({
    itemId,
    userId,
  }: {
    itemId: string;
    userId: string;
  }): Promise<TodoItemDocument> => {
    const updatedItem = await TodoItem.findByIdAndUpdate(
      itemId,
      { assignedTo: userId },
      { new: true }
    ).lean();
    if (updatedItem == null) {
      throw new Error('Failed to assign user to item');
    }
    return updatedItem;
  },

  markDone: async ({
    itemId,
  }: {
    itemId: string;
  }): Promise<TodoItemDocument> => {
    const updatedItem = await TodoItem.findByIdAndUpdate(
      itemId,
      { isCompleted: true },
      { new: true }
    ).lean();
    if (updatedItem == null) {
      throw new Error('Failed to mark item as done');
    }
    return updatedItem;
  },
};

export default TodoItemRepository;
