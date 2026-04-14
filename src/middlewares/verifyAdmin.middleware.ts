import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.error";
import { Role } from "../entities/user.entity"; // Importando o Enum oficial

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Garantimos que o objeto decoded existe para evitar erros de undefined
  const userRole = res.locals.decoded?.role;

  // Usamos o Enum para evitar erros de string manual ("ADMIN" vs "admin")
  if (userRole !== Role.ADMIN) {
    throw new AppError("Insufficient permission.", 403);
  }

  return next();
};