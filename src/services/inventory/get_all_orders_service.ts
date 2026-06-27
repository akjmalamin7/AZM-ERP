/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateServicesParams } from "@/config/types/types";
import { Document } from "mongoose";

export const get_all_orders_service = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  try {
    let page = parseInt(req.query.page as string) || 1;
    let limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    if (page < 1) page = 1;
    if (limit < 1) limit = 1;

    const skip = (page - 1) * limit;

    const match: any = {};

    // invoice search
    if (search) {
      match.invoice_number = {
        $regex: search,
        $options: "i",
      };
    }

    const total_items = await model.aggregate([
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $unwind: {
          path: "$customer",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: search
          ? {
              $or: [
                {
                  invoice_number: {
                    $regex: search,
                    $options: "i",
                  },
                },
                {
                  "customer.name": {
                    $regex: search,
                    $options: "i",
                  },
                },
              ],
            }
          : {},
      },
      {
        $count: "count",
      },
    ]);

    const orders = await model.aggregate([
      {
        $lookup: {
          from: "customers",
          localField: "customer",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $unwind: {
          path: "$customer",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: search
          ? {
              $or: [
                {
                  invoice_number: {
                    $regex: search,
                    $options: "i",
                  },
                },
                {
                  "customer.name": {
                    $regex: search,
                    $options: "i",
                  },
                },
              ],
            }
          : {},
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    const total = total_items[0]?.count || 0;

    const total_pages = Math.ceil(total / limit);

    return res.status(200).json({
      status: "success",
      message: message || "Orders retrieved successfully",
      pagination: {
        total_items: total,
        total_pages,
        current_page: page,
        limit,
        has_next: page < total_pages,
        has_prev: page > 1,
        next_page: page < total_pages ? page + 1 : null,
        prev_page: page > 1 ? page - 1 : null,
      },
      data: orders,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};
