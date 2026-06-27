/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateServicesParams } from "@/config/types/types";
import { Document } from "mongoose";

export const get_loan_service = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  try {
    const { employee_id } = req.params;

    if (!employee_id) {
      return res.status(400).json({
        status: "failed",
        message: "employee_id is required.",
      });
    }

    const loan = await model.findOne({
      employee_id,
      status: "active",
    });

    return res.status(200).json({
      status: "success",
      message: message || "Loan status retrieved successfully.",
      has_loan: !!loan,
      data: loan,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
