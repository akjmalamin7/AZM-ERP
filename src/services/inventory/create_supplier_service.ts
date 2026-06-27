/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateServicesParams } from "@/config/types/types";
import { Document } from "mongoose";

export const create_supplier_service = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  try {
    const { name, company_name, email, phone, address } = req.body;

    const user = (req as any)?.user?._id;

    // Required validation
    const requiredFields = [
      "name",
      "company_name",
      "email",
      "phone",
      "address",
    ];

    for (const field of requiredFields) {
      if (
        req.body[field] === undefined ||
        req.body[field] === null ||
        req.body[field].toString().trim() === ""
      ) {
        return res.status(400).json({
          status: "failed",
          message: `${field} is required`,
        });
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid email address",
      });
    }

    // Phone validation
    const phoneRegex = /^(\+8801|01)[3-9]\d{8}$/;

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid phone number",
      });
    }

    // Duplicate email
    const emailExists = await model.findOne({
      email: email.toLowerCase(),
    });

    if (emailExists) {
      return res.status(409).json({
        status: "failed",
        message: "Email already exists",
      });
    }

    // Duplicate phone
    const phoneExists = await model.findOne({ phone });

    if (phoneExists) {
      return res.status(409).json({
        status: "failed",
        message: "Phone already exists",
      });
    }

    // Save supplier
    const supplier = new model({
      name: name.trim(),
      company_name: company_name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      address: address.trim(),
      user,
    });

    const data = await supplier.save();

    return res.status(201).json({
      status: "success",
      message: message || "Supplier created successfully",
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

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        status: "failed",
        message: "Validation failed",
        errors,
      });
    }

    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
