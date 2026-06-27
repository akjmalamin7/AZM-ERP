/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateServicesParams } from "@/config/types/types";
import { ProductModel } from "@/models/inventory";
import { Document, Types } from "mongoose";

export const update_cart_item_service = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  try {
    const { cart, product, quantity } = req.body;

    // Validation
    if (!cart || !product || quantity === undefined) {
      return res.status(400).json({
        status: "failed",
        message: "cart, product and quantity are required.",
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

    if (Number(quantity) <= 0) {
      return res.status(400).json({
        status: "failed",
        message: "Quantity must be greater than 0.",
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

    const productData: any = await ProductModel.findById(product);

    if (!productData) {
      return res.status(404).json({
        status: "failed",
        message: "Product not found.",
      });
    }

    if (Number(quantity) > productData.quantity) {
      return res.status(400).json({
        status: "failed",
        message: `Only ${productData.quantity} item(s) available.`,
      });
    }

    const item = cartData.items.find(
      (i: any) => i.product.toString() === product,
    );

    if (!item) {
      return res.status(404).json({
        status: "failed",
        message: "Product not found in cart.",
      });
    }

    item.quantity = Number(quantity);
    item.subtotal = Number(quantity) * item.price;

    cartData.subtotal = cartData.items.reduce(
      (sum: number, item: any) => sum + item.subtotal,
      0,
    );

    cartData.total = cartData.subtotal - (cartData.discount || 0);

    await cartData.save();

    const data = await model
      .findById(cart)
      .populate("customer")
      .populate("items.product");

    return res.status(200).json({
      status: "success",
      message: message || "Cart updated successfully.",
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
