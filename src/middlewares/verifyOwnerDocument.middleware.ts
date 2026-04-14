import { NextFunction, Request, Response } from "express";
import { documentRepository } from "../repositories";
import { AppError } from "../errors/AppError.error";

export const verifyOwnerDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { foundUser } = res.locals;
  // Capturamos o id diretamente para validar o tipo logo em seguida
  const id = req.params.id;

  // 1. CORREÇÃO DO ERRO DE TIPO:
  // O Type Guard garante ao TS que, daqui para baixo, 'id' é apenas string.
  if (typeof id !== 'string') {
    throw new AppError("User does not have this document", 404);
  }

  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  if (uuidRegex.test(id)) {
    // Agora o compilador aceita o uso de 'id' no objeto 'where'
    const foundDocument = await documentRepository.findOne({
      where: { 
        user: { id: foundUser.id }, // Usando o ID do usuário para a relação
        id: id 
      },
    });

    if (!foundDocument)
      throw new AppError("User does not have this document", 404);

    res.locals = { ...res.locals, foundDocument };
  } else {
    throw new AppError("User does not have this document", 404);
  }
  
  return next();
};