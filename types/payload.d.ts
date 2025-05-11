import { Types } from 'mongoose';
import { Role } from './user.js';
export interface tokenPayload {
  _id?: string | Types.ObjectId;
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
  companyId?: string;
}
