/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { CreateServicesParams } from "@/config/types/types";
import { Document } from "mongoose";

export const get_sms_integration_service = async <T extends Document>({
  req,
  res,
  model,
}: CreateServicesParams<T>) => {
  try {
    let settings = await model.findOne();

    // First time create
    if (!settings) {
      settings = new model();
      await settings.save();
    }

    return res.status(200).json({
      status: "success",
      message: "SMS integration fetched successfully.",
      data: settings,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
