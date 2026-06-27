import { Document, Schema, Types, model } from "mongoose";
export interface IProfile extends Document {
  name: string;
  phone: string;
  designation:
    | "manager"
    | "ceo"
    | "executive"
    | "co-founder"
    | "sales_executive"
    | "accounts"
    | "hr"
    | "employee";
  address: string;
  nid: number;
  blood_group: string;
  bio?: string;
  photo?: string;
  dob: string;
  user?: string;
}
const profileSchema = new Schema<IProfile>(
  {
    name: { type: String },
    phone: {
      type: String,
      sparse: true,
      default: undefined,
    },
    designation: {
      type: String,
      enum: [
        "ceo",
        "executive",
        "co-counter",
        "manager",
        "sales_executive",
        "accounts",
        "hr",
        "employee",
      ],
      default: "employee",
    },
    address: { type: String },
    nid: { type: Number },
    blood_group: { type: String },
    bio: { type: String, default: "" },
    photo: { type: String, default: "" },
    dob: { type: String, default: "" },
    user: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false },
);
export const ProfileModel = model<IProfile>("Profile", profileSchema);
