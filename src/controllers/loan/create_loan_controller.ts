import LoanModel from "@/models/loan/loan_model";
import { create_loan_service } from "@/services/loan/create_loan_service";
import { Request, Response } from "express";

export const create_loan = async (req: Request, res: Response) => {
  await create_loan_service({
    req,
    res,
    model: LoanModel,
    message: "Loan successfully created",
  });
};
