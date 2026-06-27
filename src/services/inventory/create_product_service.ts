/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateServicesParams } from "@/config/types/types";
import { Document } from "mongoose";

export const create_product_service = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  const user = (req as any)?.user?._id;
  try {
    const body = req.body;

    const { name, code, price, cost, quantity, low_stock_threshold } = body;

    // Required Validation
    if (!name?.trim()) {
      return res.status(400).json({
        status: "failed",
        message: "Product name is required",
      });
    }

    if (!code?.trim()) {
      return res.status(400).json({
        status: "failed",
        message: "Product code is required",
      });
    }

    // Number Validation
    if (price === undefined || Number(price) <= 0) {
      return res.status(400).json({
        status: "failed",
        message: "Price must be greater than 0",
      });
    }

    if (cost === undefined || Number(cost) < 0) {
      return res.status(400).json({
        status: "failed",
        message: "Cost cannot be negative",
      });
    }

    if (quantity === undefined || Number(quantity) < 0) {
      return res.status(400).json({
        status: "failed",
        message: "Quantity cannot be negative",
      });
    }

    if (low_stock_threshold === undefined || Number(low_stock_threshold) < 0) {
      return res.status(400).json({
        status: "failed",
        message: "Low stock threshold cannot be negative",
      });
    }

    // Duplicate Product Code Check
    const existingProduct = await model.findOne({
      code: code.trim(),
    });

    if (existingProduct) {
      return res.status(409).json({
        status: "failed",
        message: "Product code already exists",
      });
    }

    const result = new model({
      ...body,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      user: user,
    });

    const data = await result.save();

    return res.status(201).json({
      status: "success",
      message: message || "Product created successfully",
      data,
    });
  } catch (err: any) {
    // Duplicate Key Error
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];

      return res.status(409).json({
        status: "failed",
        message: `${field} already exists`,
      });
    }

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((error: any) => ({
        field: error.path,
        message: error.message,
      }));

      return res.status(400).json({
        status: "failed",
        message: "Validation failed",
        errors,
      });
    }

    return res.status(500).json({
      status: "failed",
      message: err.message || "Internal Server Error",
    });
  }
};
