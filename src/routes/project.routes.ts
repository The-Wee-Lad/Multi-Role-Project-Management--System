import { Router } from 'express';

import {
  createProject,
  getProjects,
  deleteProject,
  updateProject,
} from '../controllers/project.controller.js';

const router = Router();

router.route('/:id')
  .post(createProject)
  .get(getProjects)
  .delete(deleteProject)
  .patch(updateProject);

export { router as projectRouter };
