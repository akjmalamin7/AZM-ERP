import { Document, model, Schema, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  sku?: string;
  code: string;
  category?: string;
  brand?: string;
  price: number;
  cost: number;
  quantity: number;
  low_stock_threshold: number;
  description: string;
  supplier?: string;
  image?: string;
  user?: string;
}
const product_schema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    sku: { type: String, default: "" },
    code: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    cost: { type: Number, required: true, default: 0 },
    quantity: { type: Number, required: true, default: 0 },
    low_stock_threshold: { type: Number, required: true, default: 0 },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    category: { type: Types.ObjectId, ref: "Category" },
    brand: { type: Types.ObjectId, ref: "Brand" },
    supplier: { type: Types.ObjectId, ref: "Supplier" },
    user: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false },
);

export const ProductModel = model("Product", product_schema);
