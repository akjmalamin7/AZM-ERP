/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateServicesParams } from "@/config/types/types";
import { Document, Types } from "mongoose";

export const remove_cart_item_service = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  try {
    const { cart, product } = req.body;

    // Validation
    if (!cart || !product) {
      return res.status(400).json({
        status: "failed",
        message: "cart and product are required.",
      });
    }

    if (!Types.ObjectId.isValid(cart)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid cart id.",
      });
    }

    if (!Types.ObjectId.isValid(product)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid product id.",
      });
    }

    const cartData: any = await model.findById(cart);

    if (!cartData) {
      return res.status(404).json({
        status: "failed",
        message: "Cart not found.",
      });
    }

    if (cartData.status !== "active") {
      return res.status(400).json({
        status: "failed",
        message: "Cart is not active.",
      });
    }

    const itemIndex = cartData.items.findIndex(
      (item: any) => item.product.toString() === product,
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        status: "failed",
        message: "Product not found in cart.",
      });
    }

    // Remove item
    cartData.items.splice(itemIndex, 1);

    // Recalculate subtotal
    cartData.subtotal = cartData.items.reduce(
      (sum: number, item: any) => sum + item.subtotal,
      0,
    );

    // Recalculate total
    cartData.total = cartData.subtotal - (cartData.discount || 0);

    await cartData.save();

    const data = await model
      .findById(cart)
      .populate("customer")
      .populate("items.product");

    return res.status(200).json({
      status: "success",
      message: message || "Product removed from cart successfully.",
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
