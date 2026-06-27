/* eslint-disable @typescript-eslint/no-explicit-any */
import BalanceManager from "@/@helper/balance_helper";
import { CreateServicesParams } from "@/config/types/types";
import { LoanInstallmentModel } from "@/models/accounts";
import { Document, Types } from "mongoose";

export const loan_installment_service = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  const user = (req as any)?.user?._id;

  try {
    const { id } = req.params;
    const { amount, note } = req.body;

    if (!Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid loan id.",
      });
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        status: "failed",
        message: "Amount must be greater than 0.",
      });
    }

    const loan: any = await model.findById(id);

    if (!loan) {
      return res.status(404).json({
        status: "failed",
        message: "Loan not found.",
      });
    }

    if (loan.status === "paid") {
      return res.status(400).json({
        status: "failed",
        message: "This loan has already been paid.",
      });
    }

    if (Number(amount) > loan.remaining_amount) {
      return res.status(400).json({
        status: "failed",
        message: `Remaining loan amount is ${loan.remaining_amount}.`,
      });
    }

    // Balance deduct + transaction
    await BalanceManager.credit({
      amount: Number(amount),
      reason: "loan_installment",
      note: note || `Loan installment - ${loan.employee_id}`,
      user,
    });

    // Installment history
    const installment = await LoanInstallmentModel.create({
      loan: loan._id,
      amount: Number(amount),
      note: note || "",
      user,
    });

    // Update loan
    loan.paid_amount += Number(amount);
    loan.remaining_amount -= Number(amount);

    if (loan.remaining_amount === 0) {
      loan.status = "paid";
    }

    await loan.save();

    return res.status(200).json({
      status: "success",
      message: message || "Loan installment paid successfully.",
      data: {
        loan,
        installment,
      },
    });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const validationError = error as any;
      const firstError =
        (Object.values(validationError.errors || {})[0] as any) || null;

      return res.status(400).json({
        status: "failed",
        message: firstError?.message || "Validation error",
      });
    }

    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
