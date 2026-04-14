import jwt from "jsonwebtoken";
import { Document, Schema, model } from "mongoose";
export interface IUser extends Document {
  email: string;
  otp: string;
  generateJWT(): string;
}
const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    otp: { type: String, required: true, minlength: 4, maxlength: 6 },
  },
  { timestamps: true, versionKey: false },
);
userSchema.methods.generateJWT = function (): string {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1d" },
  );
  return token;
};
const UserModel = model<IUser>("Users", userSchema);
export default UserModel;
