import jwt from "jsonwebtoken";
import { Document, Schema, model } from "mongoose";
export interface IUser extends Document {
  email: string;
  password: string;
  role: "super_admin" | "admin" | "employee";
  status: "active" | "inactive";

  employee_id: string;
  allowedMenus: string[];
  generate_jwt(): string;
}
const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    role: {
      type: String,
      enum: ["super_admin", "admin", "employee"],
      default: "employee",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      required: true,
    },

    employee_id: {
      type: String,
      required: true,
      unique: true,
    },
    allowedMenus: {
      type: [
        {
          type: String,
          enum: [
            "dashboard",
            "category",
            "customers",
            "stock",
            "mail_atleast",
            "staff",
            "sale",
            "invoice",
            "sales_report",
            "profile",
          ],
        },
      ],
      default: [],
    },
    password: {
      type: String,
      required: true,
      maxLength: 1024,
    },
  },
  { timestamps: true, versionKey: false },
);

userSchema.methods.generate_jwt = function (): string {
  const secret = process.env.SECRET_KEY;
  if (!secret) {
    throw new Error("SECRET_KEY is not defined");
  }
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    secret,
    { expiresIn: "1d" },
  );
  return token;
};
const UserModel = model<IUser>("User", userSchema);
export default UserModel;
