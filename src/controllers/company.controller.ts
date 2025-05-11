import { Request, Response } from 'express';
import {
  asyncHandler,
  ApiError,
  ApiResponse,
  ErrorCode,
  formatJoiErrors,
} from '../utils/index.js';
import Joi from 'joi';
import { Company } from '../models/company.model.js';
import { User } from '../models/user.model.js';

const createCompany = asyncHandler(async (req: Request, res: Response) => {
  const existingUser = await User.findOne({ email: req.body?.adminEmail });
  if (existingUser) {
    throw new ApiError(
      409,
      'User already exists',
      ErrorCode.EMAIL_USERNAME_CLASH
    );
  }
  const newCompany = await Company.create({
    name: req.body.name,
    domain: req.body.domain,
  });

  if (!newCompany)
    throw new ApiError(500, 'DB Error', ErrorCode.DATABASE_ERROR);

  const newAdmin = await User.create({
    name: req.body.adminName,
    email: req.body.adminEmail,
    password: req.body.adminPassword,
    companyId: newCompany._id,
    role: 'Admin',
  });

  if (!newAdmin) {
    await Company.findByIdAndDelete(newCompany._id);
    throw new ApiError(500, 'DB Error', ErrorCode.DATABASE_ERROR);
  }

  res.status(201).json(
    new ApiResponse(201, 'New Company and an admin Created', {
      company: newCompany,
      admin: {
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        companyId: newAdmin.companyId
      },
    })
  );
});

export { createCompany };
