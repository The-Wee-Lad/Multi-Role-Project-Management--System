import { Router } from 'express';

import {
  createTask,
  unassignUserFromTask,
  assignUserToTask,
  deleteTask,
  updateTask,
  getAllTasks,
} from '../controllers/task.controller.js';

const router = Router();

router.route('/create').post(createTask);
router.route('/:taskId').patch(updateTask).delete(deleteTask);
router.route('assign/:taskId').post(assignUserToTask);
router.route('unassign/:taskId').post(unassignUserFromTask);
router.route('getAllTasks').post(getAllTasks);

export { router as taskRouter };
