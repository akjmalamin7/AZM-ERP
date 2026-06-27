import {
  balance_update,
  create_expense,
  create_investment,
  create_loan,
  get_loan,
  loan_installment_controller,
  salary_create,
} from "@/controllers/accounts";
import {
  add_cart_item_controller,
  all_brands,
  brands_create,
  category_create,
  create_cart_controller,
  customers_create,
  get_all_cart_controller,
  get_all_orders,
  get_all_products,
  get_brand,
  get_cart_controller,
  get_categories,
  get_order,
  get_product,
  orders_create,
  product_code_create,
  product_create,
  remove_cart_item_controller,
  suppliers_create,
  update_cart_item_controller,
  update_customer,
  update_product,
} from "@/controllers/inventory";
import { get_category } from "@/controllers/inventory/categories_controllers";
import { checkout_cart_controller } from "@/controllers/inventory/checkout_cart_controller";
import {
  get_all_customers,
  get_customer,
} from "@/controllers/inventory/customers_controllers";
import {
  get_all_profiles,
  get_profile,
  login_controller,
  registration_controller,
  update_profile,
} from "@/controllers/users";
import authMiddleware from "@/middlewares/authMiddleWares";
import authorize from "@/middlewares/authorize";
import {
  get_low_stock_service,
  update_low_stock_service,
} from "@/services/inventory";
import { dashboardReportService } from "@/services/reports";
import { salaryReportService } from "@/services/reports/salary_filter_service";
import { Router } from "express";

const router = Router();

/******************************
 * user
 ******************************/

// create user
router.post("/super-admin/create", registration_controller);
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

// profile
router.patch("/profile/update", authMiddleware, update_profile);
router.get("/profile", authMiddleware, get_profile);
router.get("/profile/all", authMiddleware, get_all_profiles);

// user login
router.post("/login", login_controller);

/******************************
 * inventory
 ******************************/
// products
router.post("/products/create", authMiddleware, product_create);
router.patch("/products/update/:id", authMiddleware, update_product);
router.get("/products/all", get_all_products);
router.get("/products/:id", get_product);
router.post("/product-codes/create", product_code_create);

// order
router.post("/orders/create", authMiddleware, orders_create);
router.get("/orders/all", authMiddleware, get_all_orders);
router.get("/orders/:id", authMiddleware, get_order);

// cart
router.post("/cart/create", authMiddleware, create_cart_controller);
router.get("/cart/all", authMiddleware, get_all_cart_controller);
router.get("/cart/:id", authMiddleware, get_cart_controller);
router.post("/cart/add-item", authMiddleware, add_cart_item_controller);
router.patch("/cart/update-item", authMiddleware, update_cart_item_controller);
router.delete("/cart/remove-item", authMiddleware, remove_cart_item_controller);
router.post("/checkout", authMiddleware, checkout_cart_controller);

// category
router.post("/categories/create", category_create);
router.get("/categories/all", get_categories);
router.get("/categories/:id", get_category);

// brands
router.post("/brands/create", brands_create);
router.get("/brands/all", all_brands);
router.get("/brands/:id", get_brand);

// suppliers
router.post("/suppliers/create", suppliers_create);
router.get("/low-stock", authMiddleware, get_low_stock_service);
router.patch("/low-stock/:id", authMiddleware, update_low_stock_service);

// customers
router.post("/customers/create", customers_create);
router.get("/customers/all", get_all_customers);
router.patch("/customers/update/:id", update_customer);
router.get("/customers/:id", get_customer);

/******************************
 * accounts
 ******************************/
router.post(
  "/salary/create",
  authMiddleware,
  authorize("super_admin", "admin"),
  salary_create,
);
router.post("/balance/update", balance_update);
router.post(
  "/investment/create",
  authMiddleware,
  authorize("super_admin", "admin"),
  create_investment,
);
router.post(
  "/loan/create",
  authMiddleware,
  authorize("super_admin", "admin"),
  create_loan,
);
router.get("/loan/check/:employee_id", authMiddleware, get_loan);
router.post(
  "/installment/:id",
  authMiddleware,
  authorize("super_admin", "admin"),
  loan_installment_controller,
);
router.post(
  "/expense/create",
  authMiddleware,
  authorize("super_admin", "admin"),
  create_expense,
);

/******************************
 * reports
 ******************************/
router.get("/report", authMiddleware, dashboardReportService);
router.get("/salary/report", authMiddleware, salaryReportService);

export default router;
