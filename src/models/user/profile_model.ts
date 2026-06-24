import { Document, Schema, Types, model } from "mongoose";
export interface IProfile extends Document {
  name: string;
  phone: string;
  designation: "manager" | "sales_executive" | "accounts" | "hr" | "employee";
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
      enum: ["manager", "sales_executive", "accounts", "hr", "employee"],
      default: "employee",
    },
    address: { type: String },
    nid: { type: Number },
    blood_group: { type: String },
    bio: { type: String, default: "" },
    photo: { type: String, default: "" },
    dob: { type: String, default: "" },
    user: { type: Types.ObjectId, ref: "Users" },
  },
  { timestamps: true, versionKey: false },
);
const ProfileModel = model<IProfile>("Profile", profileSchema);
export default ProfileModel;
