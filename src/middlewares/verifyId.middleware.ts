import { NextFunction, Request, Response } from "express";
import { userRepository } from "../repositories";
import { AppError } from "../errors/AppError.error";

export const verifyId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Capturamos o id diretamente de req.params
  const id = req.params.id;

  // 1. CORREÇÃO DO ERRO DE TIPO:
  // Verificamos se 'id' não é uma string única. Se for undefined ou array, barramos aqui.
  if (typeof id !== 'string') {
    throw new AppError("User not found.", 404);
  }

  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  // 2. Agora o TS sabe que 'id' é estritamente uma string
  if (uuidRegex.test(id)) {
    const foundUser = await userRepository.findOneBy({ id });
    if (!foundUser) throw new AppError("User not found.", 404);

    res.locals = { ...res.locals, foundUser };
  } else {
    throw new AppError("User not found.", 404);
  }

  return next();
};