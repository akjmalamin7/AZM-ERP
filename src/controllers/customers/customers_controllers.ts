import CustomerModel from "@/models/customers/customer_model";
import { createService } from "@/services/create";
import { Request, Response } from "express";

const customers_create = async (req: Request, res: Response) => {
  await createService({
    req,
    res,
    model: CustomerModel,
    message: "Customer successfully created",
  });
};

export { customers_create };
