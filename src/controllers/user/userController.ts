import UserModel from "@/models/user/user_model";
import { registrationService } from "@/services/user";
import { loginService } from "@/services/user/login_service";
import { Request, Response } from "express";

const registration_controller = async (req: Request, res: Response) => {
  await registrationService({
    req,
    res,
    model: UserModel,
    message: "Successfully created",
  });
};
const login_controller = async (req: Request, res: Response) => {
  await loginService(req, res);
};

export { login_controller, registration_controller };
