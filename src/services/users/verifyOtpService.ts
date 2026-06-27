/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcrypt";
import { Document } from "mongoose";
export const verifyOtpService = async <T extends Document>({
  req,
  res,
  model,
}: CreateServiceParams<T>) => {
  try {
    const { email, otp, password, role } = req.body;
    if (!email || !otp) { return res.status(400).json({ status: "failed", message: "Email and OTP are required" }); }

    const user: any = await model.findOne({ email });

    if (!user) { return res.status(400).json({ status: "failed", message: "User not found" }); }
    if (!user.otp) { return res.status(400).json({ status: "failed", message: "OTP mismatched!", }); }

    if (!user.otpExpires || user.otpExpires < Date.now()) { return res.status(400).json({ status: "failed", message: "OTP expired", }); }

    const update_fields: any = { otp: null, otpExpires: null, };

    if (role) { update_fields.role = role; }

    if (password) {
      if (password.length < 6) { return res.status(400).json({ status: "failed", message: "Password must be at least 6 characters", }); }

      const salt = await bcrypt.genSalt(10);
      update_fields.password = await bcrypt.hash(password, salt);
    }

    await model.updateOne({ email }, { $set: update_fields });

    const updatedUser: any = await model.findOne({ email });

    if (!updatedUser) { return res.status(404).json({ status: "failed", message: "User not found after update", }); }

    const token = updatedUser.generateJWT();

    return res.status(200).json({
      status: "success",
      message: "OTP verified successfully",
      token,
      user: { _id: updatedUser._id, email: updatedUser.email, role: updatedUser.role, },
    });

  } catch (error: unknown) {
    console.error("verifyOtpService error:", error);
    return res.status(500).json({ status: "failed", message: error instanceof Error ? error.message : "Internal server error", });
  }
};
