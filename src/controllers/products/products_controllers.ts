import ProductModel from "@/models/product/product_model";
import { create_product_service } from "@/services/product/create_product_service";
import { Request, Response } from "express";

const product_create = async (req: Request, res: Response) => {
  await create_product_service({
    req,
    res,
    model: ProductModel,
    message: "Product successfully created",
  });
};

export { product_create };
