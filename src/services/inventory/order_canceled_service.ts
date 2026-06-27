/* eslint-disable @typescript-eslint/no-explicit-any */

import BalanceManager from "@/@helper/balance_helper";
import { CreateServicesParams } from "@/config/types/types";
import { LowStockAlertModel, ProductModel } from "@/models/inventory";
import { Document, Types } from "mongoose";

export const cancel_order_service = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  const user = (req as any)?.user?._id;

  try {
    const { id } = req.params;
    const { reason = "" } = req.body;

    if (!Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid order id.",
      });
    }

    const order: any = await model.findById(id);

    if (!order) {
      return res.status(404).json({
        status: "failed",
        message: "Order not found.",
      });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({
        status: "failed",
        message: "Order already cancelled.",
      });
    }

    // Restore Product Stock
    for (const item of order.items) {
      const product: any = await ProductModel.findById(item.product);

      if (!product) continue;

      product.quantity += item.quantity;

      await product.save();

      // Low Stock Update
      if (product.quantity <= product.low_stock_threshold) {
        const exists = await LowStockAlertModel.findOne({
          product: product._id,
        });

        if (exists) {
          exists.current_quantity = product.quantity;
          exists.is_read = false;

          await exists.save();
        } else {
          await LowStockAlertModel.create({
            product: product._id,
            current_quantity: product.quantity,
            is_read: false,
          });
        }
      } else {
        await LowStockAlertModel.findOneAndDelete({
          product: product._id,
        });
      }
    }

    // Reverse Balance (Only Paid Orders)
    if (order.payment_status === "paid") {
      await BalanceManager.debit({
        amount: order.total,
        reason: "sale",
        note: `Cancelled Invoice: ${order.invoice_number}`,
        user,
      });
    }

    order.status = "cancelled";
    order.cancel_reason = reason;
    order.cancelled_at = new Date();

    await order.save();

    return res.status(200).json({
      status: "success",
      message: message || "Order cancelled successfully.",
      data: order,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
