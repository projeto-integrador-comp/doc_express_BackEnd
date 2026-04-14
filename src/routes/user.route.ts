import { Request, Response, Router } from "express";
import { userController } from "../controllers";
import { validateBody } from "../middlewares/validateBody.middleware";
import { userCreateSchema, userUpdateSchema } from "../schemas/user.schema";
import { verifyEmail } from "../middlewares/verifyEmail.middleware";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware";
import { verifyId } from "../middlewares/verifyId.middleware";
import { verifyPermissions } from "../middlewares/verifyPermissions.middleware";

export const userRouter: Router = Router();

/**
 * ROTAS ADMINISTRATIVAS (Exclusivas Admin)
 * Usamos middlewares diretamente nestas rotas para não afetar as rotas de ID abaixo.
 */

// Listagem de todos os usuários
userRouter.get(
  "/", 
  verifyToken, 
  verifyAdmin, 
  (req: Request, res: Response) => {
    userController.read(req, res);
  }
);

// Criação de usuários (Professor, Monitor ou outro Admin)
userRouter.post(
  "/",
  verifyToken,
  verifyAdmin,
  validateBody(userCreateSchema),
  verifyEmail,
  (req: Request, res: Response) => {
    userController.create(req, res);
  }
);

/**
 * ROTAS DE RECURSO ESPECÍFICO (/:id)
 * O verifyPermissions permite o acesso se for ADMIN ou se for o DONO do ID.
 */

// Busca um usuário específico
userRouter.get(
  "/:id", 
  verifyToken, 
  verifyId, 
  verifyPermissions, 
  (req: Request, res: Response) => {
    userController.readOne(req, res);
  }
);

// Atualização de dados (ex: Senha)
userRouter.patch(
  "/:id",
  verifyToken,
  verifyId,
  verifyPermissions,
  validateBody(userUpdateSchema),
  verifyEmail, 
  (req: Request, res: Response) => {
    userController.update(req, res);
  }
);

/**
 * EXCLUSIVO ADMIN: Deleção de Usuários
 */
userRouter.delete(
  "/:id", 
  verifyToken, 
  verifyId, 
  verifyAdmin, 
  (req: Request, res: Response) => {
    userController.remove(req, res);
  }
);