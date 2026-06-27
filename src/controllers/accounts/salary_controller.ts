import { SalaryModel } from "@/models/accounts";
import { create_salary_service } from "@/services/accounts";
import { Request, Response } from "express";

const salary_create = async (req: Request, res: Response) => {
  await create_salary_service({
    req,
    res,
    model: SalaryModel,
    message: "Salary sent successful.",
  });
};

export { salary_create };
