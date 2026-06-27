/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateServicesParams } from "@/config/types/types";
import { Document } from "mongoose";

export const get_all_products_service = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  try {
    // Query Params
    let page = parseInt(req.query.page as string) || 1;
    let limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    if (page < 1) page = 1;
    if (limit < 1) limit = 1;

    const skip = (page - 1) * limit;

    const query: any = {};

    // Search
    if (search !== "") {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Total Products
    const total_products = await model.countDocuments(query);

    // Products
    const products = await model
      .find(query)
      .populate("category")
      .populate("supplier")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Pagination
    const total_pages = Math.ceil(total_products / limit);
    const has_next = page < total_pages;
    const has_prev = page > 1;

    return res.status(200).json({
      status: "success",
      message: message || "Products retrieved successfully",
      pagination: {
        total_items: total_products,
        total_pages,
        current_page: page,
        limit,
        has_next,
        has_prev,
        next_page: has_next ? page + 1 : null,
        prev_page: has_prev ? page - 1 : null,
      },
      data: products,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
