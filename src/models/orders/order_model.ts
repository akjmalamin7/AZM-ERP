import { Document, model, Schema, Types } from "mongoose";
export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}
export interface IOrder extends Document {
  invoice_number: string;
  customer?: string;
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  payment_status: "paid" | "unpaid" | "partial";
  user?: string;
}
const order_schema = new Schema<IOrder>({
  invoice_number: { type: String, default: "" },
  customer: { type: Types.ObjectId, ref: "Customers" },
  items: [
    {
      product: {
        type: Types.ObjectId,
        ref: "Product",
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
      },

      price: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  discount: { type: Number, required: true, default: 0 },
  subtotal: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true, default: 0 },
  payment_status: { type: String, required: true, default: "unpaid" },
  user: { type: Types.ObjectId, ref: "Users" },
});

const OrderModel = model("Order", order_schema);
export default OrderModel;
