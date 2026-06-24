import BrandModel from "@/models/brands/brands_model";
import { createService } from "@/services/create";
import { Request, Response } from "express";

const brands_create = async (req: Request, res: Response) => {
  await createService({
    req,
    res,
    model: BrandModel,
    message: "Brand successfully created",
  });
};

export { brands_create };
