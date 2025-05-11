import { JwtPayload } from 'jsonwebtoken';
import { tokenPayload } from '../payload';
import { IUser } from '../user';

declare module 'express' {
  export interface Request {
    user?: tokenPayload | IUser;
  }
}
