import ProductCodeModel from "@/models/product-code/product_code_model";
import { create_code_service } from "@/services/codes/create_code_service";
import { Request, Response } from "express";

const product_code_create = async (req: Request, res: Response) => {
  await create_code_service({
    req,
    res,
    model: ProductCodeModel,
    message: "Code successfully created",
  });
};

export { product_code_create };
