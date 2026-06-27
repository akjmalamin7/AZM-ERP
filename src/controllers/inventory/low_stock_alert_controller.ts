import { LowStockAlertModel } from "@/models/inventory";
import { create_low_stock_alert_service } from "@/services/inventory";
import { Request, Response } from "express";

export const create_low_stock_alert = async (req: Request, res: Response) => {
  await create_low_stock_alert_service({
    req,
    res,
    model: LowStockAlertModel,
    message: "Low stock successfully created",
  });
};
