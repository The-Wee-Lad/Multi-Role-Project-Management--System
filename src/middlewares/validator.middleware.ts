import { NextFunction, Request, Response } from 'express';
import {
  ApiError,
  asyncHandler,
  ErrorCode,
  formatJoiErrors,
} from '../utils/index.js';
import Joi from 'joi';

const validator = (validationSchema: Joi.ObjectSchema) => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { error, value } = validationSchema.validate(req.body);
      if (error)
        throw new ApiError(
          400,
          'Something is a miss in input, validation error',
          ErrorCode.VALIDATION_ERROR,
          formatJoiErrors(error)
        );
      next();
    }
  );
};
