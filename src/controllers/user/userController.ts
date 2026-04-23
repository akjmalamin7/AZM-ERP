import UserModel from "@/models/user/userModel";
import { createService } from "@/services/create";
import { createOTPService, verifyOtpService } from "@/services/user";
import { Request, Response } from "express";
const createUserController = async (req: Request, res: Response) => {
  await createService({ req, res, model: UserModel });
};

const userOtpController = async (req: Request, res: Response) => {
  await createOTPService({
    req,
    res,
    model: UserModel,
    message: "OTP sent successfully",
  });
};
const userOtpVerifyController = async (req: Request, res: Response) => {
  await verifyOtpService({
    req,
    res,
    model: UserModel,
    message: "User created successfully",
  });
};
export { createUserController, userOtpController, userOtpVerifyController };

