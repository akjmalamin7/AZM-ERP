import { CreateServicesParams } from "@/config/types/types";
import { Document } from "mongoose";

export const createService = async <T extends Document>({
  req,
  res,
  model,
  message,
}: CreateServicesParams<T>) => {
  try {
    const body = req.body;
    const result = new model(body);
    const data = await result.save();
    return res.status(201).json({
      status: "success",
      message: message || "Created successfully!",
      data: data,
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "An error occurred";
    return res.status(400).json({ status: "failed", message: errorMessage });
  }
};
