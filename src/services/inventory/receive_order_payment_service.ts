/* eslint-disable @typescript-eslint/no-explicit-any */

import BalanceManager from "@/@helper/balance_helper";
import { CreateServicesParams } from "@/config/types/types";
import { OrderPaymentModel } from "@/models/inventory/order_payment_model";
import { Document, Types } from "mongoose";

export const receive_order_payment_service = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  const user = (req as any)?.user?._id;

  try {
    const { order, amount, payment_method = "cash", note = "" } = req.body;

    // ---------------- Validation ----------------

    if (!order || !Types.ObjectId.isValid(order)) {
      return res.status(400).json({
        status: "failed",
        message: "Valid order id is required.",
      });
    }

    if (amount === undefined || amount === null || Number(amount) <= 0) {
      return res.status(400).json({
        status: "failed",
        message: "Valid payment amount is required.",
      });
    }

    // ---------------- Find Order ----------------

    const orderData: any = await model.findById(order);

    if (!orderData) {
      return res.status(404).json({
        status: "failed",
        message: "Order not found.",
      });
    }

    if (orderData.status === "cancelled") {
      return res.status(400).json({
        status: "failed",
        message: "Cancelled order cannot receive payment.",
      });
    }

    if (orderData.payment_status === "paid") {
      return res.status(400).json({
        status: "failed",
        message: "This order is already fully paid.",
      });
    }

    if (Number(amount) > orderData.due_amount) {
      return res.status(400).json({
        status: "failed",
        message: `Due amount is only ${orderData.due_amount}.`,
      });
    }

    // ---------------- Update Order ----------------

    orderData.paid_amount += Number(amount);
    orderData.due_amount -= Number(amount);

    if (orderData.due_amount <= 0) {
      orderData.due_amount = 0;
      orderData.payment_status = "paid";
    } else {
      orderData.payment_status = "partial";
    }

    await orderData.save();

    // ---------------- Save Payment History ----------------

    const payment = await OrderPaymentModel.create({
      order: orderData._id,
      invoice_number: orderData.invoice_number,
      amount: Number(amount),
      payment_method,
      note,
      user,
    });

    // ---------------- Balance Update ----------------

    await BalanceManager.credit({
      amount: Number(amount),
      reason: "sale",
      note: note || `Payment received (${orderData.invoice_number})`,
      user,
    });

    return res.status(200).json({
      status: "success",
      message: message || "Payment received successfully.",
      data: {
        order: orderData,
        payment,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
