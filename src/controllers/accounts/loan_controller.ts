import { LoanModel } from "@/models/accounts";
import { create_loan_service, get_loan_service } from "@/services/accounts";
import { Request, Response } from "express";

export const create_loan = async (req: Request, res: Response) => {
  await create_loan_service({
    req,
    res,
    model: LoanModel,
    message: "Loan successfully created",
  });
};
export const get_loan = async (req: Request, res: Response) => {
  await get_loan_service({
    req,
    res,
    model: LoanModel,
    message: "Loan retrieved successfully.",
  });
};
