import { Document } from 'mongoose';

export interface ICompany extends Document {
  _id: Types.ObjectId;
  name: string;
  domain: string;
  createdAt?: Date;
  updatedAt?: Date;
}
