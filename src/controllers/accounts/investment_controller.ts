import { InvestmentModel } from "@/models/accounts";
import { create_invest_service } from "@/services/accounts";
import { Request, Response } from "express";

export const create_investment = async (req: Request, res: Response) => {
  await create_invest_service({
    req,
    res,
    model: InvestmentModel,
    message: "Invest successfully created",
  });
};
