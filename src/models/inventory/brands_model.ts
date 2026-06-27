import { Document, model, Schema, Types } from "mongoose";

export interface IBrand extends Document {
  name: string;
  description?: string;
  user?: string;
}
const BrandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false },
);
export const BrandModel = model("Brand", BrandSchema);
