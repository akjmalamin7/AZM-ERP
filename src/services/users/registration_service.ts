/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateServicesParams } from "@/config/types/types";
import bcrypt from "bcrypt";
import { Document } from "mongoose";

const generateEmployeeId = async (model: any) => {
  const lastUser = await model
    .findOne({
      employee_id: { $exists: true },
    })
    .sort({ createdAt: -1 });

  if (!lastUser?.employee_id) {
    return "azm-100-00001";
  }

  const lastNumber = parseInt(
    lastUser.employee_id.replace("azm-", "").replaceAll("-", ""),
    10,
  );

  const nextNumber = lastNumber + 1;

  const numberStr = nextNumber.toString().padStart(8, "0");

  return `azm-${numberStr.slice(0, 3)}-${numberStr.slice(3)}`;
};

export const registrationService = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  try {
    const { email, password, role, allowedMenus } = req.body;

    const requiredFields = ["email", "password", "role"];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          status: "failed",
          message: `${field} is required`,
        });
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid email address",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: "failed",
        message: "Password must be at least 6 characters",
      });
    }

    const allowedRoles = ["super_admin", "admin", "employee"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid role",
      });
    }

    const existingUser = await model.findOne({
      email,
    });

    if (existingUser) {
      return res.status(409).json({
        status: "failed",
        message: "Email already exists",
      });
    }

    const employee_id = await generateEmployeeId(model);

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = new model({
      email,
      password: hashedPassword,
      role,
      employee_id,
      allowedMenus: allowedMenus || [],
    });

    const data: any = await result.save();
    const user = data.toObject();

    delete user.password;

    return res.status(201).json({
      status: "success",
      message: message || "User created successfully",
      data: user,
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
