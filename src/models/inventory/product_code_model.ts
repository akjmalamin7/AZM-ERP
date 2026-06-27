import { Document, model, Schema, Types } from "mongoose";

export interface IProductCode extends Document {
  code: string;
  user?: string;
}
const ProductCodeSchema = new Schema<IProductCode>(
  {
    code: { type: String, required: true, uppercase: true },
    user: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false },
);
export const ProductCodeModel = model("ProductCode", ProductCodeSchema);
