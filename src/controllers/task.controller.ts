import { Request, Response } from 'express';
import {
  asyncHandler,
  ApiError,
  ApiResponse,
  ErrorCode,
} from '../utils/index.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { cookieOptions } from '../configAndConstants.js';
import { env } from '../configAndConstants.js';

const createProject = asyncHandler(async (req: Request, res: Response) => {
  const { }
});