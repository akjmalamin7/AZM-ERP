/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateServicesParams } from "@/config/types/types";
import { Document } from "mongoose";

export const createCustomerService = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  try {
    const body = req.body;
    const requiredFields = ["name", "phone", "address"];

    for (const field of requiredFields) {
      if (!body[field]) {
        return res.status(400).json({
          status: "failed",
          message: `${field} is required`,
        });
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(body.email)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid email address",
      });
    }

    // Auto Employee ID
    const data = await model.create(body);

    return res.status(201).json({
      status: "success",
      message: message || "Created successfully!",
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
