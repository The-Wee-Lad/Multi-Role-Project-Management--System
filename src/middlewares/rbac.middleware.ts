import { asyncHandler, ApiError, ErrorCode } from '../utils/index.js';
import { User } from '../models/user.model.js';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { IUser } from '../user';

export const authorise = (...authorise: string[]): RequestHandler => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await User.findById(req?.user?._id);
      if (!user)
        throw new ApiError(
          401,
          'no user found',
          ErrorCode.DATA_NOT_FOUND_ERROR
        );

      if (!authorise.includes(user.role))
        throw new ApiError(
          403,
          'You Are not Authorised for this endpoint',
          ErrorCode.UNAUTHORIZED
        );

      if (req.user) req.user = user as IUser;
      next();
    }
  );
};
