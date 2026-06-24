import { Document, model, Schema, Types } from "mongoose";

export interface ILoanProps extends Document {
  name: string;
  employee_id: string;
  amount: number;
  user?: string;
}
const LoanSchema = new Schema<ILoanProps>(
  {
    name: { type: String, required: true },
    employee_id: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    user: { type: Types.ObjectId, ref: "Users" },
  },
  { timestamps: true, versionKey: false },
);
const LoanModel = model("Loan", LoanSchema);
export default LoanModel;
