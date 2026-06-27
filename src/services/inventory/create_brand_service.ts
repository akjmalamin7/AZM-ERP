/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateServicesParams } from "@/config/types/types";
import { Document } from "mongoose";

export const create_brand_service = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  try {
    const { name, description } = req.body;

    // Required validation
    if (!name?.trim()) {
      return res.status(400).json({
        status: "failed",
        message: "Brand name is required",
      });
    }

    // Duplicate check
    const existingBrand = await model.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
    });

    if (existingBrand) {
      return res.status(409).json({
        status: "failed",
        message: "Brand already exists",
      });
    }

    const result = new model({ name, description });
    const data = await result.save();

    return res.status(201).json({
      status: "success",
      message: message || "Brand created successfully!",
      data,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).json({
        status: "failed",
        message: "Brand already exists",
      });
    }

    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map(
        (error: any) => error.message,
      );

      return res.status(400).json({
        status: "failed",
        message: errors[0],
        errors,
      });
    }

    return res.status(500).json({
      status: "failed",
      message: err.message || "Internal Server Error",
    });
  }
};
