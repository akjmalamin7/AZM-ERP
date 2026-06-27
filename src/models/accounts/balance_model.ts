import { Document, model, Schema } from "mongoose";

export interface IBalance extends Document {
  balance: number;
}

const BalanceSchema = new Schema<IBalance>(
  {
    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const BalanceModel = model<IBalance>("Balance", BalanceSchema);
