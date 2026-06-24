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
    user: { type: Types.ObjectId, ref: "Users" },
  },
  { timestamps: true, versionKey: false },
);
const BrandModel = model("Brand", BrandSchema);
export default BrandModel;
