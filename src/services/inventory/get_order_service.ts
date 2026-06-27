/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateServicesParams } from "@/config/types/types";
import { Document, Types } from "mongoose";

export const get_order_service = async <T extends Document>({
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
        message: "Invalid order id",
      });
    }

    const order = await model
      .findById(id)
      .populate("customer")
      .populate("user")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        status: "failed",
        message: "Order not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: message || "Order retrieved successfully",
      data: order,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};
