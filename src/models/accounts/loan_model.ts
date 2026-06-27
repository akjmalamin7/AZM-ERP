import { Document, model, Schema, Types } from "mongoose";

export interface ILoanProps extends Document {
  name: string;
  employee_id: string;
  amount: number;
  paid_amount: number;
  remaining_amount: number;
  status: "active" | "paid";
  user?: string;
}

const LoanSchema = new Schema<ILoanProps>(
  {
    name: { type: String, required: true },
    employee_id: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    paid_amount: { type: Number, default: 0, min: 0 },
    remaining_amount: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ["active", "paid"], default: "active" },
    user: { type: Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const LoanModel = model<ILoanProps>("Loan", LoanSchema);
