import CategoryModel from "@/models/categories/categories_model";
import { createService } from "@/services/create";
import { Request, Response } from "express";

const category_create = async (req: Request, res: Response) => {
  await createService({
    req,
    res,
    model: CategoryModel,
    message: "Category successfully created",
  });
};

export { category_create };
