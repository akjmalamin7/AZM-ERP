import { BrandModel } from "@/models/inventory";
import {
  createService,
  get_all_brands_service,
  get_brand_service,
} from "@/services/inventory";
import { Request, Response } from "express";

export const brands_create = async (req: Request, res: Response) => {
  await createService({
    req,
    res,
    model: BrandModel,
    message: "Brand successfully created",
  });
};

export const all_brands = async (req: Request, res: Response) => {
  await get_all_brands_service({
    req,
    res,
    model: BrandModel,
    message: "Brand successfully retrieve",
  });
};
export const get_brand = async (req: Request, res: Response) => {
  await get_brand_service({
    req,
    res,
    model: BrandModel,
    message: "Brand successfully retrieve",
  });
};
