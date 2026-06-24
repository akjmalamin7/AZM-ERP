import LowStockAlertModel from "@/models/investment/investment_model";
import { create_low_stock_alert_service } from "@/services/low-stock-alert/low_stock_alert_service";
import { Request, Response } from "express";
export const create_investment = async (req: Request, res: Response) => {
  await create_low_stock_alert_service({
    req,
    res,
    model: LowStockAlertModel,
    message: "Low stock successfully created",
  });
};
