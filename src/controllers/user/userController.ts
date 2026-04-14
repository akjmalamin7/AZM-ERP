import UserModel from "@/models/user/userModel";
import { createService } from "@/services/create/createServer";
import createOTPService from "@/services/user/createOTPService";
const createUserController = async (req, res) => {
  await createService({ req, res, model: UserModel });
};

const userOtpController = async (req, res) => {
  await createOTPService({
    req,
    res,
    model: UserModel,
    message: "OTP sent successfully",
  });
};
export { createUserController, userOtpController };
