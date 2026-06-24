/* eslint-disable @typescript-eslint/no-explicit-any */
import LowStockService from "@/@helper/low_stock_alert";
import { CreateServicesParams } from "@/config/types/types";
import ProductModel from "@/models/product/product_model";
import { Document } from "mongoose";

export const create_low_stock_alert_service = async <T extends Document>({
  req,
  res,
  message,
}: CreateServicesParams<T>) => {
  try {
    const { product, sent_to } = req.body;

    if (!product) {
      return res.status(400).json({
        status: "failed",
        message: "Product is required",
      });
    }

    if (!sent_to) {
      return res.status(400).json({
        status: "failed",
        message: "sent_to is required",
      });
    }

    const productData = await ProductModel.findById(product);

    if (!productData) {
      return res.status(404).json({
        status: "failed",
        message: "Product not found",
      });
    }

    // 👉 JUST CALL HELPER (no duplicate logic here)
    const alert = await LowStockService.check({
      product: {
        _id: productData._id,
        quantity: productData.quantity,
        low_stock_threshold: productData.low_stock_threshold,
        name: productData.name,
      },
      sent_to,
    });

    return res.status(201).json({
      status: "success",
      message: message || "Low stock alert processed",
      data: alert,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
