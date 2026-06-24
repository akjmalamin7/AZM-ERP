/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateServicesParams } from "@/config/types/types";
import { Document } from "mongoose";

export const getProfileService = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  try {
    const { user } = req.params;

    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "User is required",
      });
    }

    let profile = await model.findOne({ user });

    // Profile না থাকলে create করে দিবে
    if (!profile) {
      profile = new model({
        user,
        name: "",
        phone: "",
        designation: "employee",
        address: "",
        nid: 0,
        blood_group: "",
        bio: "",
        photo: "",
        dob: "",
      });

      await profile.save();
    }

    return res.status(200).json({
      status: "success",
      message: message || "Profile retrieved successfully",
      data: profile,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
