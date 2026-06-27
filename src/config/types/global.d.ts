import { Request, Response } from "express";
import { Document, Model, Types } from "mongoose";

declare global {
  type CreateServiceParams<T extends Document> = {
    req: Request;
    res: Response;
    model: Model<T>;
    message?: string;
  };
}

export {};

declare global {
  namespace Express {
    interface UserPayload {
      _id: Types.ObjectId;
      role: string;
      email: string;
    }

    interface Request {
      user?: UserPayload;
      files?: Multer.File[];
      file?: Multer.File;
    }
  }
}

export {};
