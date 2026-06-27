/* eslint-disable @typescript-eslint/no-explicit-any */
import BalanceManager from "@/@helper/balance_helper";
import InventoryManager from "@/@helper/inventory_management";
import { CreateServicesParams } from "@/config/types/types";
import { ProductModel } from "@/models/inventory";
import { Document } from "mongoose";
const generateInvoiceNumber = () => {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `INV-${Date.now()}-${random}`;
};

export const create_order_service = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  const user = (req as any)?.user?._id;
  try {
    const body = req.body;

    const { customer, items, subtotal, discount, total, payment_status } = body;

    // ---------------- REQUIRED VALIDATION ----------------
    if (!customer) {
      return res.status(400).json({
        status: "failed",
        message: "Customer is required",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        status: "failed",
        message: "At least one product is required",
      });
    }

    // ---------------- NUMBER VALIDATION ----------------
    if (subtotal < 0) {
      return res.status(400).json({
        status: "failed",
        message: "Subtotal cannot be negative",
      });
    }

    if (discount < 0) {
      return res.status(400).json({
        status: "failed",
        message: "Discount cannot be negative",
      });
    }

    if (total < 0) {
      return res.status(400).json({
        status: "failed",
        message: "Total cannot be negative",
      });
    }

    // ---------------- PAYMENT STATUS VALIDATION ----------------
    const allowedStatus = ["paid", "unpaid", "partial"];

    if (!allowedStatus.includes(payment_status)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid payment status",
      });
    }

    // ---------------- INVOICE AUTO GENERATE ----------------
    body.invoice_number = generateInvoiceNumber();

    // quantity check
    for (const item of items) {
      const product = await ProductModel.findById(item.product);
      if (!product) {
        return res.status(404).json({
          status: "failed",
          message: "Product not found!",
        });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          status: "failed",
          message: `${product.name} stock is insufficient`,
        });
      }
    }

    // ---------------- SAVE ORDER ----------------
    const result = new model({
      ...body,
      customer: customer.trim(),
    });
    const data = await result.save();

    // update product
    for (const item of items) {
      await InventoryManager.decreaseStock(item.product, item.quantity);
    }

    // Deduct balance
    await BalanceManager.credit({
      amount: body.total,
      reason: "sale",
      note: body.invoice_number,
      user: user,
    });

    return res.status(201).json({
      status: "success",
      message: message || "Order created successfully",
      data,
    });
  } catch (err: any) {
    // Duplicate key
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];

      return res.status(409).json({
        status: "failed",
        message: `${field} already exists`,
      });
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e: any) => ({
        field: e.path,
        message: e.message,
      }));

      return res.status(400).json({
        status: "failed",
        message: "Validation failed",
        errors,
      });
    }

    return res.status(500).json({
      status: "failed",
      message: err.message || "Internal Server Error",
    });
  }
};
