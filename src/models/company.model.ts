import { Schema, Document, model, Types } from "mongoose";
import { ICompany } from "../company";
const companySchema = new Schema<ICompany>({
  name: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  }
},
  {
    timestamps: true
  });

export const Company = model("companies", companySchema);