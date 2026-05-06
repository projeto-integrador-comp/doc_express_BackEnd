import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.error";

/**
 * VERSÃO ANTERIOR (COMENTADA PARA REFERÊNCIA):
 * 
 * export const verifyPermissions = (req: Request, res: Response, next: NextFunction) => {
 *   const { id } = req.params;
 *   const { sub, admin } = res.locals.decoded;
 *   if (admin) return next();
 *   if (id !== sub) throw new AppError("Insufficient permission.", 403);
 *   return next();
 * };
 */

export const verifyPermissions = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  // 1. CORREÇÃO DE SEGURANÇA E TIPO:
  // Validação para garantir que o ID seja uma string válida antes do processamento.
  if (typeof id !== 'string') {
    throw new AppError("User not found.", 404);
  }

  const { sub, role } = res.locals.decoded;

  // 2. UNIFICAÇÃO DA LÓGICA DE PERMISSÃO:
  // Permite o acesso se o usuário possuir a role 'ADMIN' (alinhado com verifyAdmin)
  // ou se o usuário estiver tentando acessar/editar o seu próprio recurso (id === sub).
  if (role === "ADMIN" || String(sub) === String(id)) {
    return next();
  }

  throw new AppError("Insufficient permission.", 403);
};