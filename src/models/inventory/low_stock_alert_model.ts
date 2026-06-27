import { Document, model, Schema, Types } from "mongoose";

export interface ILowStockAlert extends Document {
  product: Types.ObjectId;
  current_quantity: number;
  threshold: number;
  sent_to: string;
  status: "pending" | "sent" | "resolved" | "ignored";
  message?: string;
  is_read: boolean;
}

const LowStockAlertSchema = new Schema<ILowStockAlert>(
  {
    product: {
      type: Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    current_quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    threshold: {
      type: Number,
      required: true,
      default: 10,
      min: 0,
    },

    sent_to: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "sent", "resolved", "ignored"],
      default: "pending",
    },

    message: {
      type: String,
      default: "",
    },

    is_read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Prevent duplicate active alerts for same product
LowStockAlertSchema.index({ product: 1, status: 1 });

export const LowStockAlertModel = model("LowStockAlert", LowStockAlertSchema);
