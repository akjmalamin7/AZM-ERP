import { emailSender } from "@/config/helper";
import { IUser } from "@/models/user/userModel";
import { Document } from "mongoose";
export const createOTPService = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServiceParams<T>) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ status: "failed", message: "Email not found!" });
    }

    const otp_code = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 2 * 60 * 1000);
    const isExistUser: IUser | null = await model.findOne({ email });
    const now = Date.now();

    if (
      isExistUser?.otp &&
      isExistUser?.otpExpires &&
      new Date(isExistUser.otpExpires).getTime() > now
    ) {
      return res.status(400).json({
        status: "failed",
        message: "OTP already sent. Please wait 2 minutes.",
      });
    }


    const email_text = `Your verification code is = ${otp_code}`;
    const email_subject = `Email verification`;

    await emailSender({
      emailTo: email,
      emailText: email_text,
      emailSubject: email_subject,
    });



    await model.updateOne(
      { email: email },
      { $set: { otp: otp_code, otpExpires: otpExpires, } },
      { upsert: true },
    );

    return res.status(200).json({
      status: "success",
      message: message || "6 Digit OTP has been send",
      otp: otp_code
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    console.log(errorMessage)
    return res.status(400).json({ status: "failed", message: errorMessage });
  }
};
