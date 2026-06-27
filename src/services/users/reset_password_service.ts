/* eslint-disable @typescript-eslint/no-explicit-any */

import { CreateServicesParams } from "@/config/types/types";
import bcrypt from "bcrypt";
import { Document, Types } from "mongoose";

export const reset_password_service = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  try {
    const loginUser = (req as any).user;

    const { id } = req.params;
    const { password } = req.body;

    // -------------------------
    // Only Admin
    // -------------------------

    if (loginUser.role !== "admin") {
      return res.status(403).json({
        status: "failed",
        message: "You are not authorized.",
      });
    }

    // -------------------------
    // Validation
    // -------------------------

    if (!Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid user id.",
      });
    }

    if (!password) {
      return res.status(400).json({
        status: "failed",
        message: "Password is required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: "failed",
        message: "Password must be at least 6 characters.",
      });
    }

    // -------------------------
    // Find User
    // -------------------------

    const user: any = await model.findById(id);

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found.",
      });
    }

    // -------------------------
    // Hash Password
    // -------------------------

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.must_change_password = true;
    await user.save();

    return res.status(200).json({
      status: "success",
      message: message || "Password reset successfully.",
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
