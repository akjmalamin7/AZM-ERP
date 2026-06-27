import { Document, model, Schema, Types } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  email?: string;
  phone: string;
  user?: string;
  address: string;
}
const customerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, lowercase: true },
    phone: { type: String, unique: true, required: true },
    user: { type: Types.ObjectId },
    address: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);
export const CustomerModel = model("Customer", customerSchema);
