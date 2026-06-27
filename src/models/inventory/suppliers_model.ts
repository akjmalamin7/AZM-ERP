import { Document, model, Schema, Types } from "mongoose";

export interface ISupplier extends Document {
  name: string;
  company_name: string;
  user?: string;
  phone: string;
  email: string;
  address: string;
}
const SupplierSchema = new Schema<ISupplier>(
  {
    name: { type: String, required: true },
    company_name: { type: String, required: true },
    user: { type: Types.ObjectId },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, unique: true, required: true },
    address: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);
export const SupplierModel = model("Supplier", SupplierSchema);
