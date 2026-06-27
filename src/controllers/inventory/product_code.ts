import { ProductCodeModel } from "@/models/inventory";
import { create_code_service } from "@/services/inventory";
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
