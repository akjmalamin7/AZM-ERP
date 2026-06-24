import { Document, model, Schema, Types } from "mongoose";

export interface ISalary extends Document {
  month: string;
  year: number;
  amount: number;
  payment_status: "paid" | "unpaid" | "partial";
  user?: string;
}
const salary_schema = new Schema<ISalary>({
  amount: { type: Number, required: true },
  month: {
    type: String,
    enum: [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ],
    required: true,
  },
  year: { type: Number, required: true },
  payment_status: {
    type: String,
    enum: ["paid", "unpaid", "partial"],
    default: "unpaid",
  },
  user: {
    type: Types.ObjectId,
    ref: "Users",
    required: true,
  },
});
salary_schema.index({ user: 1, month: 1, year: 1 }, { unique: true });
const SalaryModel = model("Salary", salary_schema);
export default SalaryModel;
