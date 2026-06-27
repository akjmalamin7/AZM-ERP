/* eslint-disable @typescript-eslint/no-explicit-any */

import BulkSMSBD from "@/@helper/bulksmsbd";
import { CreateServicesParams } from "@/config/types/types";
import { Document } from "mongoose";

export const send_sms_service = async <T extends Document>({
  req,
  res,
  model,
}: CreateServicesParams<T>) => {
  try {
    const { to, message } = req.body;
    let settings = await model.findOne();

    // First time create
    if (!settings) {
      settings = new model();
      await settings.save();
    }
    const integration = {
      senderid: (settings as any)?.integrations?.bulksmsbd.senderid,
      api_key: (settings as any)?.integrations?.bulksmsbd.api_key,
    };

    const sms_lib = new BulkSMSBD(integration);

    if (to && message) {
      await sms_lib.send_message({ to, message });
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
