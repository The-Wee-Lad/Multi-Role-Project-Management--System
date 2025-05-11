import { Router } from "express";

import {
  createTask,
  unassignUserFromTask,
  assignUserToTask,
  deleteTask,
  updateTask
} from '../controllers/task.controller.js'

const router = Router();



export { router as taskRouter };