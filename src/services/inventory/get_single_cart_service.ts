/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateServicesParams } from "@/config/types/types";
import { Document, Types } from "mongoose";

export const get_cart_service = async <T extends Document>({
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
        message: "Invalid cart id.",
      });
    }

    const cart = await model
      .findById(id)
      .populate("customer")
      .populate("items.product")
      .populate("user", "email employee_id");

    if (!cart) {
      return res.status(404).json({
        status: "failed",
        message: "Cart not found.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: message || "Cart retrieved successfully.",
      data: cart,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};
