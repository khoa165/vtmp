import TodoItem, { TodoItemDocument } from '@/models/todoItem.model';
import TodoItemRepository from '@/repositories/todoItem.repository';
import UserRepository from '@/repositories/user.repository';
import User from '@/models/user.model';

const TodoItemService = {
  createNew: async (itemData: TodoItemDocument) => {
    const item = await TodoItemRepository.create(itemData);
    return item;
  },
  getAllSorted: async () => {
    const items = await TodoItemRepository.getAll(1);
    return items;
  },
  updatePoints: async ({
    itemId,
    points,
  }: {
    itemId: string;
    points: number;
  }) => {
    const updatedItem = await TodoItemRepository.writePoints({
      itemId,
      points,
    });
    return updatedItem;
  },

  markItemAsDone: async ({ itemId }: { itemId: string }) => {
    const updatedItem = await TodoItemRepository.markDone({ itemId });
    return updatedItem;
  },

  assignUser: async ({
    itemId,
    userId,
  }: {
    itemId: string;
    userId: string;
  }) => {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const updatedItem = await TodoItemRepository.assign({
      itemId,
      userId,
    });
    return updatedItem;
  },
  createMock: async () => {
    const allUsers = await User.find().lean();
    console.log(allUsers);
    console.log(Math.floor(Math.random() * allUsers.length));

    const mockItems = Array.from({ length: 10 }, (_, index) => ({
      description: `This is a mock description for Todo ${index + 1}`,
      isCompleted: false,
      points: 1,
      assignedTo:
        allUsers[Math.floor(Math.random() * allUsers.length)]?._id ?? undefined,
    })) as TodoItemDocument[];
    const createdItems = await TodoItem.insertMany(mockItems);
    return createdItems;
  },
};

export default TodoItemService;
