import { Request, Response, Router } from "express";
import { userController } from "../controllers";
import { validateBody } from "../middlewares/validateBody.middleware";
import { userCreateSchema } from "../schemas/user.schema";
import { verifyEmail } from "../middlewares/verifyEmail.middleware";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { validateToken } from "../middlewares/validatetoken.middleware";
import { verifyAdimn } from "../middlewares/verifyAdimin.middleware";

export const userRouter: Router = Router();

userRouter.post(
  "/",
  validateBody(userCreateSchema),
  verifyEmail,
  (req: Request, res: Response) => {
    userController.create(req, res);
  }
);

userRouter.get(
  "/",
  verifyToken,
  validateToken,
  verifyAdimn,
  (req: Request, res: Response) => {
    userController.read(req, res);
  }
);
