/* eslint-disable @typescript-eslint/no-explicit-any */

import { CreateServicesParams } from "@/config/types/types";
import { Document } from "mongoose";

export const get_product_service = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  try {
    const { id } = req.params;

    const product = await model
      .findById(id)
      .populate("category")
      .populate("supplier")
      .lean();

    if (!product) {
      return res.status(404).json({
        status: "failed",
        message: "Product not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: message || "Product retrieved successfully",
      data: product,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
