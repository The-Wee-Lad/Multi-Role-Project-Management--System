import { Router } from 'express';
import {
  createUser,
  updateUser,
  deleteUser,
  login,
  logout,
  getCurrentUser,
  listUser,
  refreshAccessToken,
} from '../controllers/user.controller.js';

import { createCompany } from '../controllers/company.controller.js';

const router = Router();

router;

export { router as userRouter };
