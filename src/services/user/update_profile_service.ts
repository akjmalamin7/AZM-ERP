/* eslint-disable @typescript-eslint/no-explicit-any */

import { CreateServicesParams } from "@/config/types/types";
import { Document } from "mongoose";

export const updateProfileService = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  try {
    const { user } = req.params;

    const profile = await model.findOne({ user });

    let data;

    if (!profile) {
      const result = new model({
        ...req.body,
        user,
      });

      data = await result.save();
    } else {
      Object.assign(profile, req.body);
      data = await profile.save();
    }

    return res.status(200).json({
      status: "success",
      message: message || "Profile updated successfully",
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};
