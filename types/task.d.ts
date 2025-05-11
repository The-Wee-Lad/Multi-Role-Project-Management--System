import { Document, Types } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done';
  assignedTo: Types.ObjectId[];
  projectId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
