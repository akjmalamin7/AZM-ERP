/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateServicesParams } from "@/config/types/types";
import { Document, Types } from "mongoose";

export const get_category_service = async <T extends Document>({
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
        message: "Invalid category id",
      });
    }

    const category = await model.findById(id).lean();

    if (!category) {
      return res.status(404).json({
        status: "failed",
        message: "Category not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: message || "Category retrieved successfully",
      data: category,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
