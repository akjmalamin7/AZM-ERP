import SuppliersModel from "@/models/suppliers/suppliers_model";
import { createService } from "@/services/create";
import { Request, Response } from "express";

const suppliers_create = async (req: Request, res: Response) => {
  await createService({
    req,
    res,
    model: SuppliersModel,
    message: "Supplier successfully created",
  });
};

export { suppliers_create };
