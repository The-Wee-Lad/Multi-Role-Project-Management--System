// models/task.ts
import { Schema, model } from 'mongoose';
import { ITask } from '../task';

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['todo', 'inprogress', 'done'],
      required: true,
    },
    assignedTo: {
      type: [Schema.Types.ObjectId],
      ref: 'users',
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'projects',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Task = model<ITask>('tasks', taskSchema);
