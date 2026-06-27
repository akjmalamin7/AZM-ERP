import { Document, model, Schema, Types } from "mongoose";

export interface IOrderPayment extends Document {
  order: Types.ObjectId;
  invoice_number: string;
  amount: number;
  payment_method: "cash" | "bkash" | "nagad" | "bank";
  note?: string;
  user?: Types.ObjectId;
}

const orderPaymentSchema = new Schema<IOrderPayment>(
  {
    order: { type: Types.ObjectId, ref: "Order", required: true },
    invoice_number: { type: String, required: true },
    amount: { type: Number, required: true, min: 1 },
    payment_method: {
      type: String,
      enum: ["cash", "bkash", "nagad", "bank"],
      default: "cash",
    },
    note: { type: String, default: "" },
    user: { type: Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const OrderPaymentModel = model("OrderPayment", orderPaymentSchema);
