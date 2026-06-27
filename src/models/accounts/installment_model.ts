import { Document, model, Schema, Types } from "mongoose";

export interface ILoanInstallment extends Document {
  loan: Types.ObjectId;
  amount: number;
  note: string;
  user: Types.ObjectId;
}

const LoanInstallmentSchema = new Schema(
  {
    loan: { type: Types.ObjectId, ref: "Loan", required: true },
    amount: { type: Number, required: true, min: 1 },
    note: { type: String, default: "" },
    user: { type: Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const LoanInstallmentModel = model(
  "LoanInstallment",
  LoanInstallmentSchema,
);
