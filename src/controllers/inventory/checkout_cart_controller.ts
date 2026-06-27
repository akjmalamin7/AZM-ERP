/* eslint-disable @typescript-eslint/no-explicit-any */
import { checkout_cart_service } from "@/services/inventory";
import { Request, Response } from "express";

export const checkout_cart_controller = async (req: Request, res: Response) => {
  await checkout_cart_service({
    req,
    res,
    model: undefined as any,
  });
};
