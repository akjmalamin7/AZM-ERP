/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateServicesParams } from "@/config/types/types";
import { Document } from "mongoose";

export const get_all_brands_service = async <T extends Document>({
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

    const query: any = {};

    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    const total_items = await model.countDocuments(query);

    const brands = await model
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total_pages = Math.ceil(total_items / limit);

    return res.status(200).json({
      status: "success",
      message: message || "Brands retrieved successfully",
      pagination: {
        total_items,
        total_pages,
        current_page: page,
        limit,
        has_next: page < total_pages,
        has_prev: page > 1,
        next_page: page < total_pages ? page + 1 : null,
        prev_page: page > 1 ? page - 1 : null,
      },
      data: brands,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};
