import { Document } from "mongoose";

export interface IProject extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  createdBy: Types.ObjectId
  companyId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
