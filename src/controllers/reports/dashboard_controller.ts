/* eslint-disable @typescript-eslint/no-explicit-any */
import { dashboard_service } from "@/services/reports";
import { Request, Response } from "express";

export const dashboard_controller = async (req: Request, res: Response) => {
  await dashboard_service({
    req,
    res,
  } as any);
};
