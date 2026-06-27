import { OrderModel } from "@/models/inventory";
import { receive_order_payment_service } from "@/services/inventory";
import { Request, Response } from "express";

export const receive_order_payment_controller = async (
  req: Request,
  res: Response,
) => {
  await receive_order_payment_service({
    req,
    res,
    model: OrderModel,
    message: "Payment received successfully.",
  });
};
