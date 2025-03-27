import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.error";
import { ZodError } from "zod";
import { JsonWebTokenError } from "jsonwebtoken";

export const handleAppError = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  if (err instanceof AppError)
    return res.status(err.statusCode).json({ message: err.message });

  if (err instanceof ZodError)
    return res.status(400).json({ message: err.flatten().fieldErrors });

  if (err instanceof JsonWebTokenError)
    return res.status(401).json({ message: err.message });

  return res.status(500).json({ message: "Internal Server Error" });
};
