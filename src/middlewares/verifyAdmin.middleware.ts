import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.error";

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { role } = res.locals.decoded;

  if (role !== "ADMIN") throw new AppError("Insufficient permission.", 403);

  return next();
};
