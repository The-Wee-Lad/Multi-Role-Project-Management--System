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
  updateTask,
  getUserTask,
} from '../controllers/user.controller.js';

import { createCompany } from '../controllers/company.controller.js';
import { verifyToken, authorise, validator } from '../middlewares/index.js';
import {
  createCompanySchema,
  createUserInputSchema,
  deleteUSerSchema,
  loginInputSchema,
  updateSchema,
} from '../validators/user.validator.js';

const router = Router();

router
  .route('/refresh-access-token')
  .post(authorise('Admin', 'Member'), refreshAccessToken);
router.route('/company').post(validator(createCompanySchema), createCompany);

router.use(verifyToken);

router
  .route('/')
  .post(authorise('Admin'), validator(createUserInputSchema), createUser)
  .patch(authorise('Admin', 'Member'), validator(updateSchema), updateUser)
  .get(authorise('Admin', 'Member'), getCurrentUser)
  .delete(authorise('Admin'), validator(deleteUSerSchema), deleteUser);

router.route('/login').post(validator(loginInputSchema), login);

router.route('/logout').post(logout);

router.route('/list').get(authorise('Admin'), listUser);

router.route('/updateTask/:taskId').post(updateTask);

router.route('/get-user-tasks').get(getUserTask);

export { router as userRouter };
