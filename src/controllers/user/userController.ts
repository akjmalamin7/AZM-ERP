import UserModel from "@/models/user/userModel";
import { createService } from "@/services/create/createServer";
import createOTPService from "@/services/user/createOTPService";
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
export { createUserController, userOtpController };
