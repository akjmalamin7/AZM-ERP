import { Request, Response } from "express";
import { Document, Model } from "mongoose";

declare global {
  type CreateServiceParams<T extends Document> = {
    req: Request;
    res: Response;
    model: Model<T>;
    message?: string;
  };
}

export {};
