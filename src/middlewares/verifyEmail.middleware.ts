import { NextFunction, Request, Response } from "express";
import { userRepository } from "../repositories";
import { AppError } from "../errors/AppError.error";

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const { id } = req.params; // Capturamos o ID da rota, se houver

  if (!email) return next();

  const foundUser = await userRepository.findOneBy({ email });

  /**
   * Lógica de Verificação:
   * Se encontrou um usuário com este e-mail E:
   * 1. Não há ID na rota (é uma criação nova) -> Erro.
   * 2. O ID encontrado é diferente do ID da rota (é o e-mail de outra pessoa) -> Erro.
   */
  if (foundUser) {
    if (!id || foundUser.id !== id) {
      throw new AppError("Email already exists.", 409);
    }
  }

  return next();
};