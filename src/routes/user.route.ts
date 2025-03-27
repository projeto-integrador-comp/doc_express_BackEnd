import { Request, Response, Router } from "express";
import { userController } from "../controllers";
import { validateBody } from "../middlewares/validateBody.middleware";
import { userCreateSchema } from "../schemas/user.schema";
import { verifyEmail } from "../middlewares/verifyEmail.middleware";

export const userRouter: Router = Router();

userRouter.post(
  "/",
  validateBody(userCreateSchema),
  verifyEmail,
  (req: Request, res: Response) => {
    userController.create(req, res);
  }
);
