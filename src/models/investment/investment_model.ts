import { Document, model, Schema, Types } from "mongoose";

export interface InvestmentProps extends Document {
  name: string;
  investor_id: string;
  amount: number;
  user?: string;
}
const InvestmentSchema = new Schema<InvestmentProps>(
  {
    name: { type: String, required: true },
    investor_id: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    user: { type: Types.ObjectId, ref: "Users" },
  },
  { timestamps: true, versionKey: false },
);
const InvestmentModel = model("Investment", InvestmentSchema);
export default InvestmentModel;
