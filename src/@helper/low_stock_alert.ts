/* eslint-disable @typescript-eslint/no-explicit-any */
import LowStockAlertModel from "@/models/low-stock-alert/low_stock_alert_model";

class LowStockService {
  static async check({ product, sent_to }: { product: any; sent_to: string }) {
    try {
      const threshold = product.low_stock_threshold ?? 10;

      // stock OK → no alert
      if (product.quantity > threshold) return;

      // duplicate alert check
      const exists = await LowStockAlertModel.findOne({
        product: product._id,
        status: "sent",
      });

      if (exists) return;

      // create alert (save method)
      const alert = new LowStockAlertModel({
        product: product._id,
        current_quantity: product.quantity,
        threshold,
        sent_to,
        status: "sent",
        is_read: false,
      });

      await alert.save();

      return alert;
    } catch (error) {
      console.error("LowStockService error:", error);
    }
  }
}

export default LowStockService;
