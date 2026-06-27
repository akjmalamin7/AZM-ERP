import { ProductModel } from "@/models/inventory";
import {
  create_product_service,
  get_all_products_service,
  get_product_service,
  update_product_service,
} from "@/services/inventory";
import { Request, Response } from "express";

export const product_create = async (req: Request, res: Response) => {
  await create_product_service({
    req,
    res,
    model: ProductModel,
    message: "Product successfully created",
  });
};

export const get_all_products = async (req: Request, res: Response) => {
  await get_all_products_service({
    req,
    res,
    model: ProductModel,
    message: "Products retrieved successfully",
  });
};
export const get_product = async (req: Request, res: Response) => {
  await get_product_service({
    req,
    res,
    model: ProductModel,
    message: "Product retrieved successfully",
  });
};
export const update_product = async (req: Request, res: Response) => {
  await update_product_service({
    req,
    res,
    model: ProductModel,
    message: "Product updated successfully",
  });
};
