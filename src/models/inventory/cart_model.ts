import { Document, model, Schema, Types } from "mongoose";

export interface ICart extends Document {
  customer: Types.ObjectId;
  items: {
    product: Types.ObjectId;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
  subtotal: number;
  discount: number;
  total: number;
  user: Types.ObjectId;
  status: "active" | "checked_out" | "cancelled";
}

const CartSchema = new Schema(
  {
    customer: {
      type: Types.ObjectId,
      ref: "Customer",
      required: true,
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
        },
        subtotal: {
          type: Number,
          required: true,
        },
      },
    ],

    subtotal: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "checked_out", "cancelled"],
      default: "active",
    },

    user: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const CartModel = model("Cart", CartSchema);
