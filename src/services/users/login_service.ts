/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserModel } from "@/models/users";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

export const loginService = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Required Validation
    if (!email) {
      return res.status(400).json({
        status: "failed",
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        status: "failed",
        message: "Password is required",
      });
    }

    // Find User
    const user = await UserModel.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid email or password",
      });
    }

    // Account Status Check
    if (user.status !== "active") {
      return res.status(403).json({
        status: "failed",
        message: "Account is inactive",
      });
    }

    // Password Check
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: "failed",
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = user.generate_jwt();

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        status: user.status,
        employee_id: user.employee_id,
        allowedMenus: user.allowedMenus,
        must_change_password: user.must_change_password,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
