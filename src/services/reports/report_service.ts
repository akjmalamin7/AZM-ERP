/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  BalanceModel,
  ExpenseModel,
  InvestmentModel,
  LoanModel,
  SalaryModel,
  TransactionModel,
} from "@/models/accounts";
import {
  CustomerModel,
  OrderModel,
  ProductModel,
  SupplierModel,
} from "@/models/inventory";
import { Request, Response } from "express";

export const dashboardReportService = async (req: Request, res: Response) => {
  try {
    const type = (req.query.type as string) || "monthly";

    const now = new Date();
    let startDate = new Date();

    switch (type) {
      case "daily":
        startDate.setHours(0, 0, 0, 0);
        break;

      case "weekly":
        startDate.setDate(now.getDate() - 7);
        break;

      case "monthly":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;

      case "half-yearly":
        startDate.setMonth(now.getMonth() - 6);
        break;

      case "yearly":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;

      default:
        return res.status(400).json({
          status: "failed",
          message: "Invalid report type",
        });
    }

    const filter = {
      createdAt: {
        $gte: startDate,
        $lte: now,
      },
    };

    const [
      sales,
      expenses,
      salaries,
      investments,
      loans,

      orderCount,
      customerCount,
      supplierCount,
      productCount,

      lowStockCount,

      balance,

      recentOrders,
      recentTransactions,

      topSellingProducts,
    ] = await Promise.all([
      OrderModel.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$total",
            },
          },
        },
      ]),

      ExpenseModel.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      SalaryModel.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      InvestmentModel.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      LoanModel.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      OrderModel.countDocuments(filter),

      CustomerModel.countDocuments(),

      SupplierModel.countDocuments(),

      ProductModel.countDocuments(),

      ProductModel.countDocuments({
        $expr: {
          $lte: [
            "$quantity",
            {
              $ifNull: ["$low_stock_threshold", 10],
            },
          ],
        },
      }),

      BalanceModel.findOne(),

      OrderModel.find().sort({ createdAt: -1 }).limit(10).populate("customer"),

      TransactionModel.find().sort({ createdAt: -1 }).limit(10),

      OrderModel.aggregate([
        { $match: filter },

        {
          $unwind: "$items",
        },

        {
          $group: {
            _id: "$items.product",
            sold: {
              $sum: "$items.quantity",
            },
          },
        },

        {
          $sort: {
            sold: -1,
          },
        },

        {
          $limit: 10,
        },

        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },

        {
          $unwind: "$product",
        },

        {
          $project: {
            _id: 1,
            sold: 1,
            name: "$product.name",
          },
        },
      ]),
    ]);

    const totalSales = sales[0]?.total || 0;
    const totalExpense = expenses[0]?.total || 0;
    const totalSalary = salaries[0]?.total || 0;
    const totalInvestment = investments[0]?.total || 0;
    const totalLoan = loans[0]?.total || 0;

    return res.status(200).json({
      status: "success",

      period: type,

      summary: {
        sales: totalSales,

        expenses: totalExpense,

        salary: totalSalary,

        investment: totalInvestment,

        loan: totalLoan,

        profit: totalSales - (totalExpense + totalSalary),

        balance: balance?.balance || 0,

        orders: orderCount,

        customers: customerCount,

        suppliers: supplierCount,

        products: productCount,

        low_stock_products: lowStockCount,
      },

      top_selling_products: topSellingProducts,

      recent_orders: recentOrders,

      recent_transactions: recentTransactions,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};
