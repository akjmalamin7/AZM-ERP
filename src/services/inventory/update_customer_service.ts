/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateServicesParams } from "@/config/types/types";
import { Document, Types } from "mongoose";

export const update_customer_service = async <T extends Document>({
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

    const { name, phone, email, address } = req.body;

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid email address",
        });
      }
    }

    const customer = await model.findById(id);

    if (!customer) {
      return res.status(404).json({
        status: "failed",
        message: "Customer not found",
      });
    }

    const data = await model.findByIdAndUpdate(
      id,
      {
        name,
        phone,
        email,
        address,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      status: "success",
      message: message || "Customer updated successfully",
      data,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];

      return res.status(409).json({
        status: "failed",
        message: `${field} already exists`,
      });
    }

    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e: any) => ({
        field: e.path,
        message: e.message,
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
