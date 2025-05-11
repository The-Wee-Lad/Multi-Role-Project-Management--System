import { Request, Response } from 'express';
import {
  asyncHandler,
  ApiError,
  ApiResponse,
  ErrorCode,
  formatJoiErrors,
} from '../utils/index.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { cookieOptions } from '../configAndConstants.js';
import { env } from '../configAndConstants.js';

const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role = 'Member' } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(
      409,
      'User already exists',
      ErrorCode.EMAIL_USERNAME_CLASH
    );
  }
  const newUser = User.create({
    name,
    email,
    password,
    role,
    companyId: req.user?.companyId,
  });
  if (!newUser) throw new ApiError(500, 'DB Error', ErrorCode.DATABASE_ERROR);
  res
    .status(201)
    .json(
      new ApiResponse(201, 'New User Created, ask user to change password', {
        user: newUser,
      })
    );
});

const updateUser = asyncHandler(async (req: Request, res: Response) => {
  let { userId = null, name, email, newPassword, oldPassword } = req.body;

  if (userId && req.user?.role != 'Admin')
    throw new ApiError(401, 'Unauthorised', ErrorCode.UNAUTHORIZED);
  if (!userId) userId = req.user?._id;
  const updateQuery: any = {};
  if (name) updateQuery.name = name;
  if (
    req.user &&
    'checkPassword' in req.user &&
    !(await req.user?.checkPassword(oldPassword))
  )
    throw new ApiError(401, 'Invalid password', ErrorCode.INVALID_CREDENTIALS);
  const existingUser: boolean = (await User.findOne({ email: email }))
    ? true
    : false;
  if (email) {
    if (existingUser)
      throw new ApiError(
        409,
        'Username or Email already exists',
        ErrorCode.EMAIL_USERNAME_CLASH
      );
    if (email) updateQuery.email = email;
  }
  if (newPassword) updateQuery.password = newPassword;
  const newUser = await User.findByIdAndUpdate(userId, updateQuery);
  if (!newUser) throw new ApiError(500, 'DB Error', ErrorCode.DATABASE_ERROR);
  res.status(201).json(new ApiResponse(201, 'User updated', { user: newUser }));
});

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId, adminPassword } = req.body;
  if (
    req.user &&
    'checkPassword' in req.user &&
    !(await req.user?.checkPassword(adminPassword))
  )
    throw new ApiError(401, 'Invalid password', ErrorCode.INVALID_CREDENTIALS);

  const deletedUser = await User.findByIdAndDelete(req.user?._id);
  if (!deletedUser)
    throw new ApiError(400, 'Np sucj user', ErrorCode.DATA_NOT_FOUND_ERROR);
  res
    .status(200)
    .json(new ApiResponse(200, 'Deleted Succesfully', deletedUser));
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });
  if (!user) throw new ApiError(500, 'DB Error', ErrorCode.DATABASE_ERROR);
  if (!(await user?.checkPassword(password)))
    throw new ApiError(
      401,
      'Invalid Credentials',
      ErrorCode.INVALID_CREDENTIALS
    );
  const accessToken = user?.generateAccessToken();
  const refreshToken = user?.generateRefreshToken();
  if (!refreshToken || !accessToken)
    throw new ApiError(
      500,
      "Token Couldn't be generated",
      ErrorCode.UNEXPECTED_ERROR
    );
  user.refreshToken = refreshToken;
  user = await user.save();

  res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(
      new ApiResponse(200, 'Logged in', {
        user: {
          name: user.name,
          email: user.email,
          companyId: user.companyId,
          _id: user._id,
        },
        refreshToken,
        accessToken,
      })
    );
});

const logout = asyncHandler(async (req: Request, res: Response) => {
  await User.findByIdAndUpdate(req.user?._id, { refreshToken: '' });
  res
    .status(200)
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json(new ApiResponse(200, 'logged out', {}));
});

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken: string | undefined =
    req.cookies?.refreshToken ||
    req.headers?.authorization?.split(' ')[1].trim();

  if (!refreshToken)
    throw new ApiError(401, 'No Token Found', ErrorCode.TOKEN_MISSING);
  let decodedToken: any;
  try {
    decodedToken = jwt.verify(refreshToken, env.REFRESH_TOKEN_KEY) as any;
  } catch (err: unknown) {
    if (err instanceof Error)
      if (err.name === 'TokenExpiredError')
        throw new ApiError(
          401,
          'Refresh Token Expired',
          ErrorCode.EXPIRED_TOKEN
        );
      else
        throw new ApiError(
          401,
          'Invalid Refresh Token',
          ErrorCode.INVALID_TOKEN
        );
  }

  const user = await User.findById(decodedToken?._id);
  if (user?.refreshToken != refreshToken)
    throw new ApiError(401, 'Invalid Refresh Token', ErrorCode.INVALID_TOKEN);

  user.refreshToken = user.generateRefreshToken();
  let accessToken = user.generateAccessToken();
  res
    .status(200)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .cookie('accessToken', accessToken, cookieOptions)
    .json(
      new ApiResponse(200, 'Refreshed Access Token', {
        refreshToken,
        accessToken,
      })
    );
});

const listUser = asyncHandler(async (req: Request, res: Response) => {
  const { page = '1', batchSize = '10', taskId } = req.query as {
    page?: string;
    batchSize?: string;
    taskId?: string;
  };
  const queryFilter: any = {};
  if (taskId) queryFilter.taskId = taskId;
  const documents = User.countDocuments();
  const result = await User.find(queryFilter).skip((parseInt(page) - 1) * parseInt(batchSize)).limit(parseInt(batchSize));
  res.status(200).json(new ApiResponse(200, `page ${page}, batchSize ${batchSize}, taskId ${taskId}`, result));
});

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json(new ApiResponse(200, "Current Use Fetched", req.user));
});

export {
  createUser,
  updateUser,
  deleteUser,
  login,
  logout,
  getCurrentUser,
  listUser,
  refreshAccessToken
}
