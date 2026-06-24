import { Document, model, Schema, Types } from "mongoose";

export interface ITransaction extends Document {
  amount: number;
  type: "credit" | "debit";
  reason: string;
  note?: string;
  user?: Types.ObjectId;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    reason: {
      type: String,
      required: true,
      enum: ["sale", "salary", "loan", "expense", "investment", "other"],
    },
    note: {
      type: String,
      default: "",
    },
    user: {
      type: Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const TransactionModel = model<ITransaction>("Transaction", TransactionSchema);

export default TransactionModel;
