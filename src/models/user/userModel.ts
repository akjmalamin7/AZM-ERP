import jwt from "jsonwebtoken";
import { Document, Schema, model } from "mongoose";
export interface IUser extends Document {
  email: string;
  otp: string | null;
  otpExpires: Date | null;
  role: "super_admin" | "admin" | "editor" | "moderator" | "employee";
  generateJWT(): string;
  password:string;
}
const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    otp: { type: String, required: true, minlength: 4, maxlength: 6 },
    otpExpires: { type: Date, default: null },
    role: {
      type: String,
      enum: ["super_admin", "admin", "editor", "moderator", "employee"],
      default: "employee",
      required: true,
    },
    password:{type:String,required:true}
  },
  { timestamps: true, versionKey: false },
);
userSchema.methods.generateJWT = function (): string {
  const secret = process.env.SECRET_KEY;
  if (!secret) {
    throw new Error("SECRET_KEY is not defined");
  }
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    secret,
    { expiresIn: "1d" },
  );
  return token;
};
const UserModel = model<IUser>("Users", userSchema);
export default UserModel;
