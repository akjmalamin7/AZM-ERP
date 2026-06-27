/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateServicesParams } from "@/config/types/types";
import { Document, Types } from "mongoose";

export const create_cart_service = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  try {
    const user = (req as any)?.user?._id;
    const { customer } = req.body;

    if (!customer) {
      return res.status(400).json({
        status: "failed",
        message: "Customer is required.",
      });
    }

    if (!Types.ObjectId.isValid(customer)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid customer id.",
      });
    }

    // একই customer-এর active cart আছে কিনা
    const existing: any = await model.findOne({
      customer,
      status: "active",
    });

    if (existing) {
      return res.status(200).json({
        status: "success",
        message: "Active cart already exists.",
        data: existing,
      });
    }

    const cart = new model({
      customer,
      user,
      items: [],
      subtotal: 0,
      discount: 0,
      total: 0,
      status: "active",
    });

    const data = await cart.save();

    return res.status(201).json({
      status: "success",
      message: message || "Cart created successfully.",
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};
