import { Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { validateTokenProfile } from "../middlewares/validateTokenProfile.middleware";
import { profileController } from "../controllers";

export const profileRouter = Router();

profileRouter.get(
  "/",
  verifyToken,
  validateTokenProfile,
  (req: Request, res: Response) => {
    profileController.read(req, res);
  }
);
