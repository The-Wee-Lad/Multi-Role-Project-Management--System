import { Types, Document } from 'mongoose';
export type Role = 'Admin' | 'Manager' | 'User';
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: Role;
  active: Boolean;
  companyId: Types.ObjectId;
  refreshToken: string;
  createdAt?: Date;
  updatedAt?: Date;
  checkPassword(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}
