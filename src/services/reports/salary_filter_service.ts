/* eslint-disable @typescript-eslint/no-explicit-any */
import { SalaryModel } from "@/models/accounts";
import { Request, Response } from "express";

export const salaryReportService = async (req: Request, res: Response) => {
  try {
    const type = (req.query.type as string) || "monthly";
    const date = req.query.date as string;

    const selectedDate = date ? new Date(date) : new Date();

    let startDate = new Date(selectedDate);
    let endDate = new Date(selectedDate);

    switch (type) {
      case "monthly":
        startDate = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          1,
          0,
          0,
          0,
        );

        endDate = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth() + 1,
          0,
          23,
          59,
          59,
          999,
        );
        break;

      case "yearly":
        startDate = new Date(selectedDate.getFullYear(), 0, 1, 0, 0, 0);

        endDate = new Date(selectedDate.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;

      default:
        return res.status(400).json({
          status: "failed",
          message: "Invalid report type",
        });
    }

    const result = await SalaryModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          total_salary: {
            $sum: "$amount",
          },
          total_employee: {
            $sum: 1,
          },
        },
      },
    ]);

    return res.status(200).json({
      status: "success",
      type,
      start_date: startDate,
      end_date: endDate,
      total_salary: result[0]?.total_salary || 0,
      total_employee: result[0]?.total_employee || 0,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};
