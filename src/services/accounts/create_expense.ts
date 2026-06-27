/* eslint-disable @typescript-eslint/no-explicit-any */
import BalanceManager from "@/@helper/balance_helper";
import { CreateServicesParams } from "@/config/types/types";
import { Document } from "mongoose";

export const create_expense_service = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  const user = (req as any)?.user?._id;
  try {
    const { type, amount, note } = req.body;

    // Required validation
    const requiredFields = ["type", "amount"];

    for (const field of requiredFields) {
      if (
        req.body[field] === undefined ||
        req.body[field] === null ||
        req.body[field] === ""
      ) {
        return res.status(400).json({
          status: "failed",
          message: `${field} is required`,
        });
      }
    }

    // Expense type validation
    const allowedTypes = [
      "online_marketing",
      "offline_marketing",
      "gift",
      "office_expense",
      "transport_expense",
      "electricity_expense",
      "assets_expense",
      "damaged",
    ];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid expense type",
      });
    }

    // Amount validation
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        status: "failed",
        message: "Amount must be greater than 0",
      });
    }

    // Save expense
    const expense = new model({
      type,
      amount: Number(amount),
      note: note || "",
      user,
    });

    const data = await expense.save();

    // Balance update + Transaction create
    await BalanceManager.debit({
      amount: Number(amount),
      reason: type,
      note: note || `${type} expense`,
      user,
    });

    return res.status(201).json({
      status: "success",
      message: message || "Expense created successfully",
      data,
    });
  } catch (err: any) {
    // Duplicate key
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];

      return res.status(409).json({
        status: "failed",
        message: `${field} already exists`,
      });
    }

    // Validation Error
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
