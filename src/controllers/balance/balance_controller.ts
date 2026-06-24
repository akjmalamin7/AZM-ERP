import BalanceModel from "@/models/balance/balance_model";
import { update_balance_service } from "@/services/balance/balance_service";
import { Request, Response } from "express";

const balance_update = async (req: Request, res: Response) => {
  await update_balance_service({
    req,
    res,
    model: BalanceModel,
    message: "Balance updated successful.",
  });
};

export { balance_update };
