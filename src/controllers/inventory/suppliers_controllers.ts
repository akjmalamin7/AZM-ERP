import { SupplierModel } from "@/models/inventory";
import { createService } from "@/services/inventory";
import { Request, Response } from "express";

const suppliers_create = async (req: Request, res: Response) => {
  await createService({
    req,
    res,
    model: SupplierModel,
    message: "Supplier successfully created",
  });
};
export { suppliers_create };
