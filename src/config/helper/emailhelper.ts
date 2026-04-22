import dotenv from "dotenv";
import nodemailer from "nodemailer";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const emailSender = async ({ emailTo, emailText, emailSubject }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emailTo,
    subject: emailSubject,
    text: emailText,
  };

  try {const info = await transporter.sendMail(mailOptions)} catch (error) {console.log("MAIL ERROR:", error)}
};
