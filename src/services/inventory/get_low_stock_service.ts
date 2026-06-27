/* eslint-disable @typescript-eslint/no-explicit-any */
import { LowStockAlertModel } from "@/models/inventory";
import { Request, Response } from "express";

export const get_low_stock_service = async (req: Request, res: Response) => {
  try {
    // Query Params
    let page = parseInt(req.query.page as string) || 1;
    let limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    if (page < 1) page = 1;
    if (limit < 1) limit = 1;

    const skip = (page - 1) * limit;

    const query: any = {
      status: {
        $in: ["pending", "sent"],
      },
    };

    // Search by product name
    if (search) {
      query.$or = [
        {
          "product.name": {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const total_items = await LowStockAlertModel.countDocuments(query);

    const alerts = await LowStockAlertModel.find(query)
      .populate("product")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Search after populate (optional)
    const filteredAlerts = search
      ? alerts.filter((item: any) =>
          item.product?.name?.toLowerCase().includes(search.toLowerCase()),
        )
      : alerts;

    const total_pages = Math.ceil(total_items / limit);
    const has_next = page < total_pages;
    const has_prev = page > 1;

    return res.status(200).json({
      status: "success",
      message: "Low stock alerts retrieved successfully",
      pagination: {
        total_items,
        total_pages,
        current_page: page,
        limit,
        has_next,
        has_prev,
        next_page: has_next ? page + 1 : null,
        prev_page: has_prev ? page - 1 : null,
      },
      data: filteredAlerts,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
