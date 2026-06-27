import { ProfileModel, UserModel } from "@/models/users";
import {
  get_all_profile_service,
  get_profile_service,
  loginService,
  registrationService,
  reset_password_service,
  update_password_service,
  updateProfileService,
} from "@/services/users";
import { Request, Response } from "express";

export const registration_controller = async (req: Request, res: Response) => {
  await registrationService({
    req,
    res,
    model: UserModel,
    message: "Successfully created",
  });
};

export const login_controller = async (req: Request, res: Response) => {
  await loginService(req, res);
};

export const get_profile = async (req: Request, res: Response) => {
  await get_profile_service({
    req,
    res,
    model: ProfileModel,
    message: "Get Profile retrieve",
  });
};
export const get_all_profiles = async (req: Request, res: Response) => {
  await get_all_profile_service({
    req,
    res,
    model: ProfileModel,
    message: "Get Profiles retrieve",
  });
};
export const update_profile = async (req: Request, res: Response) => {
  await updateProfileService({
    req,
    res,
    model: ProfileModel,
    message: "Profile updated successfully",
  });
};

export const update_password_controller = async (
  req: Request,
  res: Response,
) => {
  await update_password_service({
    req,
    res,
    model: UserModel,
    message: "Password updated successfully.",
  });
};

export const reset_password_controller = async (
  req: Request,
  res: Response,
) => {
  await reset_password_service({
    req,
    res,
    model: UserModel,
    message: "Password reset successfully.",
  });
};
