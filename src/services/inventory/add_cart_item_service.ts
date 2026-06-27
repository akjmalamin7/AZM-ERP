/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateServicesParams } from "@/config/types/types";
import { ProductModel } from "@/models/inventory";
import { Document, Types } from "mongoose";

export const add_cart_item_service = async <T extends Document>({
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

    // Cart
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

    // Product
    const productData: any = await ProductModel.findById(product);

    if (!productData) {
      return res.status(404).json({
        status: "failed",
        message: "Product not found.",
      });
    }

    if (productData.quantity < Number(quantity)) {
      return res.status(400).json({
        status: "failed",
        message: `Only ${productData.quantity} item(s) available.`,
      });
    }

    // Already exists?
    const existingItem = cartData.items.find(
      (item: any) => item.product.toString() === product,
    );

    if (existingItem) {
      const newQty = existingItem.quantity + Number(quantity);

      if (newQty > productData.quantity) {
        return res.status(400).json({
          status: "failed",
          message: `Only ${productData.quantity} item(s) available.`,
        });
      }

      existingItem.quantity = newQty;
      existingItem.subtotal = newQty * existingItem.price;
    } else {
      cartData.items.push({
        product: productData._id,
        quantity: Number(quantity),
        price: productData.price,
        subtotal: Number(quantity) * productData.price,
      });
    }

    // Recalculate
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
      message: message || "Product added to cart successfully.",
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "failed",
      message: error.message || "Internal Server Error",
    });
  }
};
