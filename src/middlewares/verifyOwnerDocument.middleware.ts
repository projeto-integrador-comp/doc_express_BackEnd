import { NextFunction, Request, Response } from "express";
import { documentRepository } from "../repositories";
import { AppError } from "../errors/AppError.error";

export const verifyOwnerDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { foundUser } = res.locals;
  const { id } = req.params;

  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  if (uuidRegex.test(id)) {
    const foundDocument = await documentRepository.findOne({
      where: { user: foundUser, id },
    });

    if (!foundDocument)
      throw new AppError("User does not have this document", 404);

    res.locals = { ...res.locals, foundDocument };
  } else {
    throw new AppError("User does not have this document", 404);
  }
  return next();
};
