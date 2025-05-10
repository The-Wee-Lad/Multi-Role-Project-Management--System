import { Schema, Document, model, Types } from "mongoose";
import { IProject } from "../project";
const projectSchema = new Schema<IProject>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'companies'
  }
},
  {
    timestamps: true
  });

export const Project = model("projects", projectSchema);