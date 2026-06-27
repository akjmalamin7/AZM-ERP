/* eslint-disable @typescript-eslint/no-explicit-any */

import { CreateServicesParams } from "@/config/types/types";
import bcrypt from "bcrypt";
import { Document } from "mongoose";

export const update_password_service = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  try {
    const userId = (req as any)?.user?._id;

    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
      return res.status(400).json({
        status: "failed",
        message: "Old password and new password are required.",
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        status: "failed",
        message: "New password must be at least 6 characters.",
      });
    }

    const user: any = await model.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(old_password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        status: "failed",
        message: "Old password is incorrect.",
      });
    }

    const samePassword = await bcrypt.compare(new_password, user.password);

    if (samePassword) {
      return res.status(400).json({
        status: "failed",
        message: "New password cannot be the same as the old password.",
      });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    user.password = hashedPassword;
    user.must_change_password = false;
    await user.save();

    return res.status(200).json({
      status: "success",
      message: message || "Password updated successfully.",
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
