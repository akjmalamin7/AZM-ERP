import {
  createUserController,
  userOtpController,
  userOtpVerifyController,
} from "@/controllers/user/userController";
import { Router } from "express";

const router = Router();
/* =========================
 start users routes
 ========================= */
router.post("/user/create", createUserController);
router.post("/user-send-otp", userOtpController);
router.post("/user-verify-otp", userOtpVerifyController);
export default router;
