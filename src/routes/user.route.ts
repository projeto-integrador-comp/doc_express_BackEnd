import { Request, Response, Router } from "express";
import { userController } from "../controllers";
import { validateBody } from "../middlewares/validateBody.middleware";
import { userCreateSchema, userUpdateSchema } from "../schemas/user.schema";
import { verifyEmail } from "../middlewares/verifyEmail.middleware";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { validateToken } from "../middlewares/validatetoken.middleware";
import { verifyAdimn } from "../middlewares/verifyAdimin.middleware";
import { verifyId } from "../middlewares/verifyId.middleware";
import { verifyPermissions } from "../middlewares/verifyPermissions.middleware";

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

userRouter.use("/:id", verifyToken, validateToken, verifyId, verifyPermissions);
userRouter.get("/:id", (req: Request, res: Response) => {
  userController.readOne(req, res);
});
userRouter.patch(
  "/:id",
  validateBody(userUpdateSchema),
  verifyEmail,
  (req: Request, res: Response) => {
    userController.update(req, res);
  }
);
userRouter.delete("/:id", (req: Request, res: Response) => {
  userController.remove(req, res);
});
