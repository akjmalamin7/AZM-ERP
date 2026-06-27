import { LowStockAlertModel, ProductModel } from "@/models/inventory";
import LowStockService from "./low_stock_alert";

class InventoryManager {
  static async decreaseStock(
    productId: string,
    quantity: number,
    sent_to = "admin@inventory.com",
  ) {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        $inc: {
          quantity: -quantity,
        },
      },
      {
        new: true,
      },
    );

    if (!updatedProduct) {
      throw new Error("Product not found");
    }

    await LowStockService.check({
      product: {
        _id: updatedProduct._id,
        quantity: updatedProduct.quantity,
        low_stock_threshold: updatedProduct.low_stock_threshold,
        name: updatedProduct.name,
      },
      sent_to,
    });

    return updatedProduct;
  }

  static async increaseStock(productId: string, quantity: number) {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      {
        $inc: {
          quantity,
        },
      },
      {
        new: true,
      },
    );

    if (!updatedProduct) {
      throw new Error("Product not found");
    }

    // Resolve low stock alert
    if (updatedProduct.quantity > (updatedProduct.low_stock_threshold ?? 10)) {
      await LowStockAlertModel.updateMany(
        {
          product: updatedProduct._id,
          status: { $in: ["pending", "sent"] },
        },
        {
          $set: {
            status: "resolved",
          },
        },
      );
    }

    return updatedProduct;
  }
}

export default InventoryManager;
