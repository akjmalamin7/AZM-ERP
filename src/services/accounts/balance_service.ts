/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateServicesParams } from "@/config/types/types";
import { TransactionModel } from "@/models/accounts";
import { Document } from "mongoose";

export const update_balance_service = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  try {
    const { amount, type, reason, note, user } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        status: "failed",
        message: "Amount must be greater than 0",
      });
    }

    if (!["credit", "debit"].includes(type)) {
      return res.status(400).json({
        status: "failed",
        message: "Type must be credit or debit",
      });
    }

    if (!reason) {
      return res.status(400).json({
        status: "failed",
        message: "Reason is required",
      });
    }

    let balanceDoc: any = await model.findOne();

    if (!balanceDoc) {
      balanceDoc = new model({
        balance: 0,
      });
    }

    if (type === "debit") {
      if (balanceDoc.balance < Number(amount)) {
        return res.status(400).json({
          status: "failed",
          message: "Insufficient balance",
        });
      }

      balanceDoc.balance -= Number(amount);
    }

    if (type === "credit") {
      balanceDoc.balance += Number(amount);
    }

    await balanceDoc.save();

    const transaction = await TransactionModel.create({
      amount,
      type,
      reason,
      note,
      user,
    });

    return res.status(200).json({
      status: "success",
      message: message || "Balance updated successfully",
      balance: balanceDoc,
      transaction,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
