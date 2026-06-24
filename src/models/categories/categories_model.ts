import { Document, model, Schema, Types } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  description?: string;
  user?: string;
}
const categorySchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: Types.ObjectId },
  },
  { timestamps: true, versionKey: false },
);
const CategoryModel = model("Category", categorySchema);
export default CategoryModel;
