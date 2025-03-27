import { NextFunction, Request, Response } from "express";
import { userRepository } from "../repositories";
import { AppError } from "../errors/AppError.error";

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  if (!email) return next();

  const foundUser = await userRepository.findOneBy({ email });
  if (foundUser) throw new AppError("Email already exists.");
  return next();
};
