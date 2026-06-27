/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderModel } from "@/models/inventory";
import { get_invoice_service } from "@/services/inventory";
import { Request, Response } from "express";

export const get_invoice_controller = async (req: Request, res: Response) => {
  await get_invoice_service({
    req,
    res,
    model: OrderModel as any,
    message: "Invoice retrieved successfully.",
  });
};
