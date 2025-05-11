import { Router } from 'express';

import {
  createProject,
  getProjects,
  deleteProject,
  updateProject,
} from '../controllers/project.controller.js';

const router = Router();

export { router as projectRouter };
