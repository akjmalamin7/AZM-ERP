import { CustomerModel } from "@/models/inventory";
import {
  createService,
  get_all_customer_service,
  get_customer_service,
  update_product_service,
} from "@/services/inventory";
import { Request, Response } from "express";

export const customers_create = async (req: Request, res: Response) => {
  await createService({
    req,
    res,
    model: CustomerModel,
    message: "Customer successfully created",
  });
};
export const update_customer = async (req: Request, res: Response) => {
  await update_product_service({
    req,
    res,
    model: CustomerModel,
    message: "Customer successfully updated",
  });
};
export const get_customer = async (req: Request, res: Response) => {
  await get_customer_service({
    req,
    res,
    model: CustomerModel,
    message: "Get Customer successfully retrieve",
  });
};
export const get_all_customers = async (req: Request, res: Response) => {
  await get_all_customer_service({
    req,
    res,
    model: CustomerModel,
    message: "Get Customers successfully retrieve",
  });
};
