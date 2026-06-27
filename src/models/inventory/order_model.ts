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
  status: "completed" | "cancelled";
  payment_status: "paid" | "unpaid" | "partial";
  cancel_reason: string;
  due_amount: number;
  paid_amount: number;
  cancelled_at?: string;
  user?: string;
}
const order_schema = new Schema<IOrder>(
  {
    invoice_number: { type: String, required: true },
    customer: { type: Types.ObjectId, ref: "Customer" },
    paid_amount: {
      type: Number,
      default: 0,
    },

    due_amount: {
      type: Number,
      default: 0,
    },
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
    status: {
      type: String,
      enum: ["completed", "cancelled"],
      default: "completed",
    },

    cancel_reason: {
      type: String,
      default: "",
    },

    cancelled_at: {
      type: Date,
    },
    payment_status: { type: String, required: true, default: "unpaid" },
    user: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false },
);

export const OrderModel = model("Order", order_schema);
