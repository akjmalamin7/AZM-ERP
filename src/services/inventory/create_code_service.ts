/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateServicesParams } from "@/config/types/types";
import { Document } from "mongoose";

export const create_code_service = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  try {
    const body = req.body;
    const { code } = body;

    // Required validation
    if (!code?.trim()) {
      return res.status(400).json({
        status: "failed",
        message: "Code is required",
      });
    }

    // Format validation
    // Example: ABC123, PRD-001, CODE2025
    const codeRegex = /^[A-Za-z0-9-_]+$/;

    if (!codeRegex.test(code)) {
      return res.status(400).json({
        status: "failed",
        message:
          "Code can contain only letters, numbers, hyphen (-) and underscore (_)",
      });
    }

    // Duplicate validation
    const existingCode = await model.findOne({
      code: code.trim().toUpperCase(),
    });

    if (existingCode) {
      return res.status(409).json({
        status: "failed",
        message: "Product code already exists",
      });
    }

    body.code = code.trim().toUpperCase();

    const result = new model(body);
    const data = await result.save();

    return res.status(201).json({
      status: "success",
      message: message || "Created successfully!",
      data,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(409).json({
        status: "failed",
        message: "Product code already exists",
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
