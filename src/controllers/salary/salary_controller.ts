import SalaryModel from "@/models/salary/salary_model";
import { create_salary_service } from "@/services/salary/create_salary";
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
