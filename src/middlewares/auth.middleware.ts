import jwt, { JwtPayload } from 'jsonwebtoken';
import { asyncHandler, ApiError, ApiResponse, ErrorCode } from '../utils/index.js';
import { Request, Response, NextFunction } from 'express';
import { env } from '../configAndConstants.js';
import { tokenPayload } from '../payload.js';

const verifyToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken: string | undefined =
      req.cookies?.accessToken ||
      req.headers?.authorization?.split(' ')[1].trim();

    if (!accessToken) {
      throw new ApiError(401, ' No Access Token Found!', ErrorCode.TOKEN_MISSING);
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(accessToken, env.ACCESS_TOKEN_KEY) as JwtPayload;
    } catch (err: unknown) {
      if (err instanceof Error)
        if (err.name === 'TokenExpiredError')
          throw new ApiError(401, 'Access Token Expired', ErrorCode.EXPIRED_TOKEN);
        else throw new ApiError(401, 'Invalid Token', ErrorCode.INVALID_TOKEN);
    }

    if (
      typeof decodedToken === 'object' &&
      decodedToken &&
      'email' in decodedToken &&
      'companyId' in decodedToken &&
      'name' in decodedToken &&
      '_id' in decodedToken
    ) {
      req.user = decodedToken as tokenPayload;
      next();
    } else {
      throw new ApiError(401, 'Invalid Token Payload', ErrorCode.INVALID_TOKEN);
    }
  }
);

export { verifyToken };
