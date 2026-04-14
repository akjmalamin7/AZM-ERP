import { emailSender } from "@/config/helper";
import { Document } from "mongoose";

const createOTPService = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServiceParams<T>) => {
  try {
    const { email } = req.body;
    const otp_code = Math.floor(100000 + Math.random() * 900000);

    const email_text = `Your verification code is = ${otp_code}`;
    const email_subject = `Email verification`;

    await emailSender({
      emailTo: email,
      emailText: email_text,
      emailSubject: email_subject,
    });

    await model.updateOne(
      { email: email },
      { $set: { otp: otp_code } },
      { upsert: true },
    );

    return res.status(200).json({
      status: "success",
      message: message || "6 Digit OTP has been send",
    });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "An error occurred";
    return res.status(400).json({ status: "failed", message: errorMessage });
  }
};

export default createOTPService;
