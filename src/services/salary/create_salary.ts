/* eslint-disable @typescript-eslint/no-explicit-any */
import BalanceManager from "@/@helper/balance_helper";
import { CreateServicesParams } from "@/config/types/types";
import BalanceModel from "@/models/balance/balance_model";
import { Document } from "mongoose";
export const create_salary_service = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  try {
    const body = req.body;

    const requiredFields = ["month", "amount", "payment_status", "year"];

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

    // Payment status validation
    const allowedStatus = ["paid", "unpaid", "partial"];

    if (!allowedStatus.includes(body.payment_status)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid payment status.",
      });
    }

    // Month validation
    const allowedMonths = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];

    if (!allowedMonths.includes(body.month)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid month.",
      });
    }

    // একই user-এর একই month duplicate salary block
    if (body.user) {
      const existingSalary = await model.findOne({
        user: body.user,
        month: body.month,
        year: body.year,
      });
      if (existingSalary) {
        return res.status(409).json({
          status: "failed",
          message: `Salary already exists for ${body.month}-${body.year}.`,
        });
      }
    }

    const get_balance = await BalanceModel.findOne();
    if (!get_balance) {
      return res.status(400).json({
        status: "failed",
        message: "Balance not initialized.",
      });
    }
    if (get_balance.balance < body.amount) {
      return res.status(400).json({
        status: "failed",
        message: "Insufficient balance.",
      });
    }
    console.log(get_balance);
    // Save salary
    const result = new model(body);
    const data = await result.save();

    // Deduct balance
    // Deduct balance
    await BalanceManager.debit({
      amount: body.amount,
      reason: "salary",
      note: `Salary from SOMUDRO BAZAR:  ${body.month}-${body.year}`,
      user: body.user,
    });

    return res.status(201).json({
      status: "success",
      message: message || "Salary created successfully!",
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
