import InvestmentModel from "@/models/investment/investment_model";
import { create_invest_service } from "@/services/investment/investment_service";
import { Request, Response } from "express";

export const create_investment = async (req: Request, res: Response) => {
  await create_invest_service({
    req,
    res,
    model: InvestmentModel,
    message: "Invest successfully created",
  });
};
