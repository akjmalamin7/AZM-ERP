import { CategoryModel } from "@/models/inventory";
import {
  createService,
  get_all_categories_service,
  get_category_service,
} from "@/services/inventory";
import { Request, Response } from "express";

export const category_create = async (req: Request, res: Response) => {
  await createService({
    req,
    res,
    model: CategoryModel,
    message: "Category successfully created",
  });
};
export const get_categories = async (req: Request, res: Response) => {
  await get_all_categories_service({
    req,
    res,
    model: CategoryModel,
    message: "Categories retrieved successfully",
  });
};
export const get_category = async (req: Request, res: Response) => {
  await get_category_service({
    req,
    res,
    model: CategoryModel,
    message: "Categories retrieved successfully",
  });
};
