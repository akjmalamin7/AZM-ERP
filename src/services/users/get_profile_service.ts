/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateServicesParams } from "@/config/types/types";
import { Document, Types } from "mongoose";

export const get_profile_service = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  const user = (req as any)?.user?._id;
  try {
    if (!Types.ObjectId.isValid(user as string)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid user id",
      });
    }

    let profile = await model
      .findOne({ user })
      .populate("user", "email role status employee_id allowedMenus");

    // Profile না থাকলে create করে নাও
    if (!profile) {
      profile = await new model({
        user,
      }).save();

      profile = await model
        .findOne({ user })
        .populate("user", "email role status employee_id allowedMenus");
    }

    return res.status(200).json({
      status: "success",
      message: message || "Profile retrieved successfully",
      data: profile,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];

      return res.status(409).json({
        status: "failed",
        message: `${field} already exists`,
      });
    }

    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e: any) => ({
        field: e.path,
        message: e.message,
      }));

      return res.status(400).json({
        status: "failed",
        message: "Validation failed",
        errors,
      });
    }

    return res.status(500).json({
      status: "failed",
      message: err.message || "Internal Server Error",
    });
  }
};
