import OrderModel from "@/models/orders/order_model";
import { create_order_service } from "@/services/orders/create_order_service";
import { Request, Response } from "express";

const orders_create = async (req: Request, res: Response) => {
  await create_order_service({
    req,
    res,
    model: OrderModel,
    message: "Orders successfully created",
  });
};

export { orders_create };
