import { balance_update } from "@/controllers/balance/balance_controller";
import { brands_create } from "@/controllers/brands/brands_controllers";
import { category_create } from "@/controllers/categories/categories_controllers";
import { customers_create } from "@/controllers/customers/customers_controllers";
import { create_investment } from "@/controllers/investment/investment_controller";
import { create_loan } from "@/controllers/loan/create_loan_controller";
import { orders_create } from "@/controllers/orders/orders_controllers";
import { product_code_create } from "@/controllers/product-code/product_code";
import { product_create } from "@/controllers/products/products_controllers";
import { salary_create } from "@/controllers/salary/salary_controller";
import { suppliers_create } from "@/controllers/suppliers/suppliers_controllers";
import {
  login_controller,
  registration_controller,
} from "@/controllers/user/userController";
import authMiddleware from "@/middlewares/authMiddleWares";
import authorize from "@/middlewares/authorize";
import { create_low_stock_alert_service } from "@/services/low-stock-alert/low_stock_alert_service";
import { Router } from "express";

const router = Router();
/* =========================
 start users routes
 ========================= */
router.post("/users/create", registration_controller);
router.post(
  "/admin/create",
  authMiddleware,
  authorize("super_admin"),
  registration_controller,
);
router.post(
  "/employee/create",
  authMiddleware,
  authorize("super_admin", "admin"),
  registration_controller,
);
router.post("/login", login_controller);

router.post("/categories/create", category_create);
router.post("/brands/create", brands_create);
router.post("/suppliers/create", suppliers_create);
router.post("/customers/create", customers_create);
router.post("/product-codes/create", product_code_create);
router.post("/products/create", product_create);
router.post("/orders/create", orders_create);
router.post("/salary/create", salary_create);
router.post("/balance/update", balance_update);
router.post("/investment/create", create_investment);
router.post("/loan/create", create_loan);
router.post("/alert/create", create_low_stock_alert_service);
export default router;
