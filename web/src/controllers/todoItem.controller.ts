import { TodoItemDocument } from '@/models/todoItem.model';
import TodoItemService from '@/services/todoItem.service';
import { Request, Response } from 'express';

const ITEMS_PER_PAGE = 4;

const TodoItemController = {
  getAllTodoItems: async (req: Request, res: Response) => {
    try {
      const items = await TodoItemService.getAllSorted();
      const pageNumber = parseInt(req.query.page as string) || 1;
      if (
        pageNumber < 1 ||
        pageNumber > Math.ceil(items.length / ITEMS_PER_PAGE)
      ) {
        res.status(400).json({ message: 'Invalid page number' });
        return;
      }
      const itemsInPage = items.slice(
        (pageNumber - 1) * ITEMS_PER_PAGE,
        pageNumber * ITEMS_PER_PAGE
      );
      res.status(200).json({
        success: true,
        data: itemsInPage,
        hasNextPage: items.length > pageNumber * ITEMS_PER_PAGE,
        hasPrevPage: pageNumber > 1,
        nextPage:
          items.length > pageNumber * ITEMS_PER_PAGE ? pageNumber + 1 : null,
        prevPage: pageNumber > 1 ? pageNumber - 1 : null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      res.status(401).json({ message: errorMessage });
    }
  },
  createNewItem: async (req: Request, res: Response) => {
    try {
      const item = await TodoItemService.createNew(
        req.body as TodoItemDocument
      );
      res.status(201).json({
        success: true,
        data: item,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      res.status(401).json({ message: errorMessage });
    }
  },
  updatePoints: async (req: Request, res: Response) => {
    const itemId = req.query.itemId as string | undefined;
    const points = req.body.points as number;

    if (itemId == null || points == null) {
      res.status(400).json({ message: 'Missing itemId or points' });
      return;
    }
    try {
      const updatedItem = await TodoItemService.updatePoints({
        itemId,
        points,
      });
      res.status(200).json({
        success: true,
        data: updatedItem,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      res.status(401).json({ message: errorMessage });
    }
  },
  assignUser: async (req: Request, res: Response) => {
    const itemId = req.params.itemId;
    const userId = req.body.userId as string;

    if (itemId == null || userId == null) {
      res.status(400).json({ message: 'Missing itemId or userId' });
      return;
    }
    try {
      const updatedItem = await TodoItemService.assignUser({
        itemId,
        userId,
      });
      res.status(200).json({
        success: true,
        data: updatedItem,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      res.status(401).json({ message: errorMessage });
    }
  },
  createMock: async (_req: Request, res: Response) => {
    try {
      await TodoItemService.createMock();
      res.status(201).json({ message: 'Mock items created' });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      res.status(401).json({ message: errorMessage });
    }
  },
  markItemAsDone: async (req: Request, res: Response) => {
    const itemId = req.query.itemId as string | undefined;

    if (itemId == null) {
      res.status(400).json({ message: 'Missing itemId' });
      return;
    }
    try {
      const updatedItem = await TodoItemService.markItemAsDone({ itemId });
      res.status(200).json({
        success: true,
        data: updatedItem,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      res.status(401).json({ message: errorMessage });
    }
  },
};

export default TodoItemController;
