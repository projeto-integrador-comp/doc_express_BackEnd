import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.error";
import { userRepository } from "../repositories";

export const verifyUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { sub } = res.locals.decoded;
  const foundUser = await userRepository.findOneBy({ id: sub });

  if (!foundUser) throw new AppError("invalid signature", 401);
  res.locals = { ...res.locals, foundUser };

  return next();
};
