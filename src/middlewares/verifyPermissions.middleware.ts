import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.error";
import { Role } from "../entities/user.entity";

export const verifyPermissions = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { sub, role } = res.locals.decoded;

  // 1. Liberação para Admin
  if (role === Role.ADMIN) return next();

  // 2. Comparação de IDs
  // Usamos .toString() e .trim() para garantir que espaços ou formatos não estraguem a comparação
  if (id?.toString().trim() !== sub?.toString().trim()) {
    throw new AppError("Insufficient permission.", 403);
  }

  return next();
};