/* eslint-disable @typescript-eslint/no-explicit-any */

import { CreateServicesParams } from "@/config/types/types";
import { Document, Types } from "mongoose";

export const get_invoice_service = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid order id.",
      });
    }

    const invoice = await model
      .findById(id)
      .populate("customer")
      .populate("items.product");

    if (!invoice) {
      return res.status(404).json({
        status: "failed",
        message: "Invoice not found.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: message || "Invoice retrieved successfully.",
      data: invoice,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
