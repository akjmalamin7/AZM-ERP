import { LoanModel } from "@/models/accounts";
import { loan_installment_service } from "@/services/accounts";
import { Request, Response } from "express";

export const loan_installment_controller = async (
  req: Request,
  res: Response,
) => {
  await loan_installment_service({
    req,
    res,
    model: LoanModel,
    message: "Loan installment paid successfully.",
  });
};
