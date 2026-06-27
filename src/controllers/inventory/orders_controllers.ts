import { OrderModel } from "@/models/inventory";
import {
  cancel_order_service,
  create_order_service,
  get_all_orders_service,
  get_order_service,
} from "@/services/inventory";
import { Request, Response } from "express";

export const orders_create = async (req: Request, res: Response) => {
  await create_order_service({
    req,
    res,
    model: OrderModel,
    message: "Order successfully created",
  });
};
export const get_all_orders = async (req: Request, res: Response) => {
  await get_all_orders_service({
    req,
    res,
    model: OrderModel,
    message: "Orders retrieved successfully",
  });
};
export const get_order = async (req: Request, res: Response) => {
  await get_order_service({
    req,
    res,
    model: OrderModel,
    message: "Order retrieved successfully",
  });
};
export const canceled_order = async (req: Request, res: Response) => {
  await cancel_order_service({
    req,
    res,
    model: OrderModel,
    message: "Order canceled successfully",
  });
};
