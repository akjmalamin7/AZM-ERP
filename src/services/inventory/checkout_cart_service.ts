/* eslint-disable @typescript-eslint/no-explicit-any */
import BalanceManager from "@/@helper/balance_helper";
import { CreateServicesParams } from "@/config/types/types";
import {
  LowStockAlertModel,
  OrderModel,
  ProductModel,
} from "@/models/inventory";
import { CartModel } from "@/models/inventory/cart_model";
import { Document, Types } from "mongoose";

export const checkout_cart_service = async <T extends Document>({
  req,
  res,
}: CreateServicesParams<T>) => {
  const user = (req as any)?.user?._id;

  try {
    const { cart, payment_status = "paid", paid_amount = 0 } = req.body;

    // ------------------------
    // Validation
    // ------------------------

    if (!cart) {
      return res.status(400).json({
        status: "failed",
        message: "Cart id is required.",
      });
    }

    if (!Types.ObjectId.isValid(cart)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid cart id.",
      });
    }

    if (!["paid", "unpaid", "partial"].includes(payment_status)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid payment status.",
      });
    }

    if (payment_status === "partial") {
      if (paid_amount === undefined || Number(paid_amount) <= 0) {
        return res.status(400).json({
          status: "failed",
          message: "paid_amount is required for partial payment.",
        });
      }
    }
    // ------------------------
    // Find Cart
    // ------------------------

    const cartData: any = await CartModel.findById(cart)
      .populate("customer")
      .populate("items.product");

    if (!cartData) {
      return res.status(404).json({
        status: "failed",
        message: "Cart not found.",
      });
    }

    if (cartData.status !== "active") {
      return res.status(400).json({
        status: "failed",
        message: "Cart already checked out.",
      });
    }

    if (!cartData.items.length) {
      return res.status(400).json({
        status: "failed",
        message: "Cart is empty.",
      });
    }

    // ------------------------
    // Generate Invoice
    // ------------------------

    const lastOrder = await OrderModel.findOne().sort({
      createdAt: -1,
    });

    let invoice_number = "INV-000001";

    if (lastOrder?.invoice_number) {
      const lastNumber = Number(lastOrder.invoice_number.replace("INV-", ""));

      invoice_number = `INV-${String(lastNumber + 1).padStart(6, "0")}`;
    }

    // ------------------------
    // Stock Validation
    // ------------------------

    for (const item of cartData.items) {
      const product: any = await ProductModel.findById(item.product._id);

      if (!product) {
        return res.status(404).json({
          status: "failed",
          message: `${item.product.name} not found.`,
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          status: "failed",
          message: `${product.name} has only ${product.quantity} item(s) available.`,
        });
      }
    }

    let orderPaidAmount = 0;
    let orderDueAmount = cartData.total;

    if (payment_status === "paid") {
      orderPaidAmount = cartData.total;
      orderDueAmount = 0;
    }

    if (payment_status === "unpaid") {
      orderPaidAmount = 0;
      orderDueAmount = cartData.total;
    }

    if (payment_status === "partial") {
      if (Number(paid_amount) > cartData.total) {
        return res.status(400).json({
          status: "failed",
          message: "Paid amount cannot exceed total amount.",
        });
      }

      orderPaidAmount = Number(paid_amount);
      orderDueAmount = cartData.total - Number(paid_amount);
    }
    // ------------------------
    // Prepare Order Data
    // ------------------------

    const orderData = {
      invoice_number,
      customer: cartData.customer._id,
      items: cartData.items.map((item: any) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
      })),
      payment_status,
      paid_amount: orderPaidAmount,
      due_amount: orderDueAmount,
      subtotal: cartData.subtotal,
      discount: cartData.discount,
      total: cartData.total,
      user,
    };

    // --------------------------------------
    // Create Order
    // --------------------------------------

    const order = await OrderModel.create(orderData);

    // --------------------------------------
    // Update Product Stock
    // --------------------------------------

    for (const item of cartData.items) {
      const product: any = await ProductModel.findById(item.product._id);

      if (!product) continue;

      product.quantity -= item.quantity;

      if (product.quantity < 0) {
        product.quantity = 0;
      }

      await product.save();

      // --------------------------------------
      // Low Stock Update / Create
      // --------------------------------------

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
        // যদি stock আবার threshold-এর উপরে চলে যায়
        await LowStockAlertModel.findOneAndDelete({
          product: product._id,
        });
      }
    }

    // --------------------------------------
    // Balance Update
    // --------------------------------------

    if (payment_status === "paid") {
      await BalanceManager.credit({
        amount: orderPaidAmount,
        reason: "sale",
        note: `Invoice: ${invoice_number}`,
        user,
      });
    }

    // --------------------------------------
    // Update Cart
    // --------------------------------------

    cartData.status = "checked_out";

    await cartData.save();

    // --------------------------------------
    // Populate Order
    // --------------------------------------

    const data = await OrderModel.findById(order._id)
      .populate("customer")
      .populate("items.product");

    // --------------------------------------
    // Response
    // --------------------------------------

    return res.status(201).json({
      status: "success",
      message: "Checkout completed successfully.",
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
