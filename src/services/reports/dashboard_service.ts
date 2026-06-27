/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { CreateServicesParams } from "@/config/types/types";
import { LowStockAlertModel, OrderModel } from "@/models/inventory";
import { Document } from "mongoose";

export const dashboard_service = async <T extends Document>({
  req,
  res,
}: CreateServicesParams<T>) => {
  try {
    // -------------------------
    // Today
    // -------------------------

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // -------------------------
    // Month
    // -------------------------

    const monthStart = new Date(
      todayStart.getFullYear(),
      todayStart.getMonth(),
      1,
    );

    const monthEnd = new Date(
      todayStart.getFullYear(),
      todayStart.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    // -------------------------
    // Year
    // -------------------------

    const yearStart = new Date(todayStart.getFullYear(), 0, 1);

    const yearEnd = new Date(todayStart.getFullYear(), 11, 31, 23, 59, 59, 999);

    // -------------------------
    // Today Sales
    // -------------------------

    const todaySales = await OrderModel.aggregate([
      {
        $match: {
          status: "completed",
          payment_status: "paid",
          createdAt: {
            $gte: todayStart,
            $lte: todayEnd,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$paid_amount",
          },
        },
      },
    ]);

    // -------------------------
    // Monthly Sales
    // -------------------------

    const monthlySales = await OrderModel.aggregate([
      {
        $match: {
          status: "completed",
          payment_status: "paid",
          createdAt: {
            $gte: monthStart,
            $lte: monthEnd,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$paid_amount",
          },
        },
      },
    ]);

    // -------------------------
    // Yearly Sales
    // -------------------------

    const yearlySales = await OrderModel.aggregate([
      {
        $match: {
          status: "completed",
          payment_status: "paid",
          createdAt: {
            $gte: yearStart,
            $lte: yearEnd,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$paid_amount",
          },
        },
      },
    ]);

    // -------------------------
    // Today's Orders
    // -------------------------

    const todayOrders = await OrderModel.countDocuments({
      status: "completed",
      createdAt: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    });

    // -------------------------
    // Low Stock
    // -------------------------

    const lowStockCount = await LowStockAlertModel.countDocuments();

    return res.status(200).json({
      status: "success",

      data: {
        today_sales: todaySales.length > 0 ? todaySales[0].total : 0,

        monthly_sales: monthlySales.length > 0 ? monthlySales[0].total : 0,

        yearly_sales: yearlySales.length > 0 ? yearlySales[0].total : 0,

        today_orders: todayOrders,

        low_stock: lowStockCount,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
