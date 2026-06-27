/* eslint-disable @typescript-eslint/no-explicit-any */

import { CreateServicesParams } from "@/config/types/types";
import { Document } from "mongoose";

const gateways = ["reve", "ada", "bulksmsbd"] as const;

export const update_sms_integration_service = async <T extends Document>({
  req,
  res,
  model,
}: CreateServicesParams<T>) => {
  try {
    const { integrations, setup } = req.body;

    const settings: any = await model.findOne();

    if (!settings) {
      return res.status(404).json({
        status: "failed",
        message: "SMS settings not found.",
      });
    }

    // -----------------------------
    // Integrations
    // -----------------------------

    if (integrations) {
      if (integrations.reve) {
        settings.integrations.reve = {
          api_key:
            integrations.reve.api_key ?? settings.integrations.reve.api_key,

          secret_key:
            integrations.reve.secret_key ??
            settings.integrations.reve.secret_key,

          caller_id:
            integrations.reve.caller_id ?? settings.integrations.reve.caller_id,
        };
      }

      if (integrations.ada) {
        settings.integrations.ada = {
          username:
            integrations.ada.username ?? settings.integrations.ada.username,

          password:
            integrations.ada.password ?? settings.integrations.ada.password,

          sender: integrations.ada.sender ?? settings.integrations.ada.sender,
        };
      }

      if (integrations.bulksmsbd) {
        settings.integrations.bulksmsbd = {
          senderid:
            integrations.bulksmsbd.senderid ??
            settings.integrations.bulksmsbd.senderid,

          api_key:
            integrations.bulksmsbd.api_key ??
            settings.integrations.bulksmsbd.api_key,
        };
      }
    }

    // -----------------------------
    // Setup
    // -----------------------------

    if (setup) {
      const setupKeys = Object.keys(setup);

      for (const key of setupKeys) {
        if (!settings.setup[key]) continue;

        settings.setup[key] = {
          status: setup[key].status ?? settings.setup[key].status,

          gateway:
            setup[key].gateway && gateways.includes(setup[key].gateway)
              ? setup[key].gateway
              : settings.setup[key].gateway,

          format: setup[key].format ?? settings.setup[key].format,
        };
      }
    }

    await settings.save();

    return res.status(200).json({
      status: "success",
      message: "SMS settings updated successfully.",
      data: settings,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
