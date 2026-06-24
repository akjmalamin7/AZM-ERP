import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Response | void => {
  let token = req.header("Authorization");

  if (!token && req.cookies && req.cookies.token) {
    token = `Bearer ${req.cookies.token}`;
  }

  if (!token) {
    return res.status(401).json({
      status: "failed",
      message: "Access denied. No token provided!",
    });
  }

  try {
    const extractedToken = token.split(" ")[1].trim();

    const decoded = jwt.verify(
      extractedToken,
      process.env.SECRET_KEY as string,
    );

    req.user = decoded;
    next();
  } catch (err: unknown) {
    console.log(err);
    return res.status(400).json({
      status: "fail",
      message: "Invalid token",
    });
  }
};

export default authMiddleware;
