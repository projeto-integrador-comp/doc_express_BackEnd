import { Request, Response, Router } from "express";
import { validateBody } from "../middlewares/validateBody.middleware";
import { loginSchema } from "../schemas/login.schema";
import { loginController } from "../controllers";

export const loginRouter = Router();

loginRouter.post(
  "/",
  validateBody(loginSchema),
  (req: Request, res: Response) => {
    loginController.login(req, res);
  }
);
