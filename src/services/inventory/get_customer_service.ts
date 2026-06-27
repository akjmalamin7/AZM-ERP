/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateServicesParams } from "@/config/types/types";
import { Document, Types } from "mongoose";

export const get_customer_service = async <T extends Document>({
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
        message: "Invalid customer id",
      });
    }

    const data = await model.findById(id);

    if (!data) {
      return res.status(404).json({
        status: "failed",
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: message || "Customer retrieved successfully",
      data,
    });
  } catch (err: any) {
    return res.status(500).json({
      status: "failed",
      message: err.message || "Internal Server Error",
    });
  }
};
