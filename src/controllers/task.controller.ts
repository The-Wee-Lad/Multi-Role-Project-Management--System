import { Request, Response } from 'express';
import {
  asyncHandler,
  ApiError,
  ApiResponse,
  ErrorCode,
} from '../utils/index.js';
import { Project } from '../models/project.model.js';
import { Task } from '../models/task.model.js';

const createTask = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, assignedTo, projectId } = req.body;

  const newTask = await Task.create({
    title,
    description,
    status: 'todo',
    assignedTo,
    projectId,
  });

  res
    .status(201)
    .json(new ApiResponse(201, 'Task created successfully', newTask));
});

const assignUserToTask = asyncHandler(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { userId } = req.body;

  const task = await Task.findById(taskId);

  if (!task)
    throw new ApiError(404, 'Task not found', ErrorCode.DATA_NOT_FOUND_ERROR);

  const alreadyAssigned = task.assignedTo.some(
    (id) => id.toString() === userId.toString()
  );

  if (alreadyAssigned) {
    throw new ApiError(
      409,
      'User already assigned to task',
      ErrorCode.ALREADY_EXISTS
    );
  }

  task.assignedTo.push(userId);
  await task.save();

  res
    .status(200)
    .json(new ApiResponse(200, 'User assigned to task successfully', task));
});

const unassignUserFromTask = asyncHandler(
  async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const { userId } = req.body;

    const task = await Task.findById(taskId);

    if (!task)
      throw new ApiError(404, 'Task not found', ErrorCode.DATA_NOT_FOUND_ERROR);

    const initialLength = task.assignedTo.length;
    task.assignedTo = task.assignedTo.filter(
      (id) => id.toString() !== userId.toString()
    );

    if (task.assignedTo.length === initialLength)
      throw new ApiError(
        500,
        'User was not assigned to this task',
        ErrorCode.DATABASE_ERROR
      );

    await task.save();
    res
      .status(200)
      .json(new ApiResponse(200, 'User unassigned from task', task));
  }
);

const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const { taskId } = req.params;

  const deletedTask = await Task.findByIdAndDelete(taskId);

  if (!deletedTask) {
    throw new ApiError(
      404,
      'No such task found',
      ErrorCode.DATA_NOT_FOUND_ERROR
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, 'Task deleted successfully', deletedTask));
});

const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { title, description, status, assignedTo, projectId } = req.body;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, 'Task not found', ErrorCode.DATA_NOT_FOUND_ERROR);
  }

  task.title = title || task.title;
  task.description = description || task.description;
  task.status = status || task.status;
  task.assignedTo = assignedTo || task.assignedTo;
  task.projectId = projectId || task.projectId;

  const updatedTask = await task.save();

  res
    .status(200)
    .json(new ApiResponse(200, 'Task updated successfully', updatedTask));
});

const getAllTasks = asyncHandler(async (req: Request, res: Response) => {
  // TODO:
});

export {
  createTask,
  unassignUserFromTask,
  assignUserToTask,
  deleteTask,
  updateTask,
  getAllTasks,
};
