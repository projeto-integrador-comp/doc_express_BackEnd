import { NextFunction, Request, Response } from "express";
import { userRepository } from "../repositories";
import { AppError } from "../errors/AppError.error";

export const verifyId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  if (uuidRegex.test(id)) {
    const foundUser = await userRepository.findOneBy({ id });
    if (!foundUser) throw new AppError("User not found.", 404);

    res.locals = { ...res.locals, foundUser };
  } else {
    throw new AppError("User not found.", 404);
  }

  return next();
};
