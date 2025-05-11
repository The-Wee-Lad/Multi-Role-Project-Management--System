import { Router } from "express";
import {
  createUser,
  updateUser,
  deleteUser,
  login,
  logout,
  getCurrentUser,
  listUser,
  refreshAccessToken
} from '../controllers/user.controller.js'

import { createCompany } from '../controllers/company.controller.js';
import { verifyToken, authorise, validator } from "../middlewares/index.js";
import { createUserInputSchema, deleteUSerSchema, loginInputSchema, updateSchema } from "../validators/user.validator.js";

const router = Router();

router.route('/refresh-access-token')
  .post(authorise('admin', 'users'), refreshAccessToken);
router.route('/company').post(createCompany);

router.use(verifyToken);

router.route('/')
  .post(authorise('admin'), validator(createUserInputSchema), createUser)
  .patch(authorise('admin', 'users'), validator(updateSchema), updateUser)
  .get(authorise('admin', 'users'), getCurrentUser)
  .delete(authorise('admin'), validator(deleteUSerSchema), deleteUser);

router.route('/login')
  .post(authorise('admin', 'users'), validator(loginInputSchema), login);

router.route('/logout')
  .post(authorise('admin', 'users'), logout);

router.route('/list')
  .get(authorise('admin'), listUser);


export { router as userRouter };