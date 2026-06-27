/* eslint-disable @typescript-eslint/no-explicit-any */
import BalanceManager from "@/@helper/balance_helper";
import { CreateServicesParams } from "@/config/types/types";
import { Document } from "mongoose";

export const create_invest_service = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  console.log("Service Hit");
  const user = (req as any)?.user?._id;
  try {
    const body = req.body;

    const requiredFields = ["name", "amount", "investor_id"];

    for (const field of requiredFields) {
      if (
        body[field] === undefined ||
        body[field] === null ||
        body[field] === ""
      ) {
        return res.status(400).json({
          status: "failed",
          message: `${field} is required.`,
        });
      }
    }

    // Amount validation
    if (Number(body.amount) <= 0) {
      return res.status(400).json({
        status: "failed",
        message: "Amount must be greater than 0.",
      });
    }

    // Save salary
    const result = new model(body);
    const data = await result.save();

    // Deduct balance
    // Deduct balance
    await BalanceManager.credit({
      amount: body.amount,
      reason: "investment",
      note: `Investment:  ${body.name}-${body.amount}`,
      user: user,
    });

    return res.status(201).json({
      status: "success",
      message: message || "Invest created successfully!",
      data,
    });
  } catch (error: any) {
    // Mongoose Validation Error
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);

      return res.status(400).json({
        status: "failed",
        message: errors[0],
        errors,
      });
    }

    // Duplicate Key Error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];

      return res.status(409).json({
        status: "failed",
        message: `${field} already exists.`,
      });
    }

    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
