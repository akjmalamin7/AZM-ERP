import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";

/*************************
 * Multer Storage
 *************************/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

/*************************
 * Upload Instance
 *************************/

const upload = multer({
  storage,
});

/*************************
 * Upload Middleware
 *************************/

export const handleFileUpload = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  upload.any()(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        status: "failed",
        message: err.message,
      });
    }

    next();
  });
};
