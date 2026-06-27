/* eslint-disable @typescript-eslint/no-explicit-any */

import { CreateServicesParams } from "@/config/types/types";
import { Document, Types } from "mongoose";

export const update_product_service = async <T extends Document>({
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
        message: "Invalid product id",
      });
    }

    const product = (await model.findById(id)) as any;

    if (!product) {
      return res.status(404).json({
        status: "failed",
        message: "Product not found",
      });
    }

    const {
      name,
      category,
      supplier,
      quantity,
      buy_price,
      sale_price,
      low_stock_threshold,
      description,
      unit,
    } = req.body;

    // Validation
    if (quantity !== undefined && Number(quantity) < 0) {
      return res.status(400).json({
        status: "failed",
        message: message || "Quantity cannot be negative",
      });
    }

    if (buy_price !== undefined && Number(buy_price) < 0) {
      return res.status(400).json({
        status: "failed",
        message: "Buy price cannot be negative",
      });
    }

    if (sale_price !== undefined && Number(sale_price) < 0) {
      return res.status(400).json({
        status: "failed",
        message: "Sale price cannot be negative",
      });
    }

    if (low_stock_threshold !== undefined && Number(low_stock_threshold) < 0) {
      return res.status(400).json({
        status: "failed",
        message: "Low stock threshold cannot be negative",
      });
    }

    // Update only provided fields
    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (supplier !== undefined) product.supplier = supplier;
    if (quantity !== undefined) product.quantity = Number(quantity);
    if (buy_price !== undefined) product.buy_price = Number(buy_price);
    if (sale_price !== undefined) product.sale_price = Number(sale_price);
    if (low_stock_threshold !== undefined) {
      product.low_stock_threshold = Number(low_stock_threshold);
    }
    if (description !== undefined) product.description = description;
    if (unit !== undefined) product.unit = unit;

    await product.save();

    const data = await model
      .findById(product._id)
      .populate("category")
      .populate("supplier");

    return res.status(200).json({
      status: "success",
      message: message || "Product updated successfully",
      data,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];

      return res.status(409).json({
        status: "failed",
        message: `${field} already exists`,
      });
    }

    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
