import { ExpenseModel } from "@/models/accounts/expense";
import { create_expense_service } from "@/services/accounts";
import { Request, Response } from "express";

export const create_expense = async (req: Request, res: Response) => {
  await create_expense_service({
    req,
    res,
    model: ExpenseModel,
    message: "Balance updated successful.",
  });
};
