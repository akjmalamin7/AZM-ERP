import { Document, model, Schema, Types } from "mongoose";

export interface IExpense extends Document {
  type:
    | "online_marketing"
    | "offline_marketing"
    | "gift"
    | "office_expense"
    | "transport_expense"
    | "electricity_expense"
    | "assets_expense"
    | "damaged";
  amount: number;
  note: string;
  user?: string;
}

const expense_schema = new Schema<IExpense>(
  {
    type: {
      type: String,
      enum: [
        "online_marketing",
        "offline_marketing",
        "gift",
        "office_expense",
        "transport_expense",
        "electricity_expense",
        "assets_expense",
        "damaged",
      ],
      required: true,
    },
    note: { type: String, default: "" },
    amount: { type: Number, required: true, min: 0 },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);
export const ExpenseModel = model<IExpense>("Expense", expense_schema);
