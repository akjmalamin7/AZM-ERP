import { SMSIntegrationModel } from "@/models/sms";
import {
  get_sms_integration_service,
  send_sms_service,
  update_sms_integration_service,
} from "@/services/sms";
import { Request, Response } from "express";

export const update_sms_integration_controller = async (
  req: Request,
  res: Response,
) => {
  await update_sms_integration_service({
    req,
    res,
    model: SMSIntegrationModel,
  });
};
export const get_sms_integration_controller = async (
  req: Request,
  res: Response,
) => {
  await get_sms_integration_service({
    req,
    res,
    model: SMSIntegrationModel,
  });
};
export const send_sms_controller = async (req: Request, res: Response) => {
  await send_sms_service({
    req,
    res,
    model: SMSIntegrationModel,
  });
};
