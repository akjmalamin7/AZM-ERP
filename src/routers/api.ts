import {
  createUserController,
  userOtpController,
} from "@/controllers/user/userController";
import { Router } from "express";

const router = Router();
/* =========================
 start users routes
 ========================= */
router.post("/user/create", createUserController);
router.post("/user-otp", userOtpController);
export default router;
