/* eslint-disable @typescript-eslint/no-explicit-any */
import { LowStockAlertModel } from "@/models/inventory";
import { Request, Response } from "express";

export const update_low_stock_service = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { is_read } = req.body;

    if (typeof is_read !== "boolean") {
      return res.status(400).json({
        status: "failed",
        message: "is_read must be true or false",
      });
    }

    const alert = await LowStockAlertModel.findById(id);

    if (!alert) {
      return res.status(404).json({
        status: "failed",
        message: "Low stock alert not found",
      });
    }

    alert.is_read = is_read;

    await alert.save();

    return res.status(200).json({
      status: "success",
      message: "Low stock alert updated successfully",
      data: alert,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
