import { NextFunction, Response } from "express";
import { AuthRequest } from "./authMiddleWares";

const authorize =
  (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (
      !req.user ||
      typeof req.user === "string" ||
      !("role" in req.user) ||
      typeof req.user.role !== "string"
    ) {
      res.status(401).json({
        status: "failed",
        message: "Unauthorized",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        status: "failed",
        message: "Permission denied",
      });
      return;
    }

    next();
  };

export default authorize;
