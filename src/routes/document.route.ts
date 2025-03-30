import { Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { verifyUserExists } from "../middlewares/verifyUserExists.middleware";
import { validateBody } from "../middlewares/validateBody.middleware";
import { documentCreateSchema } from "../schemas/document.schema";
import { documentController } from "../controllers";

export const documentRouter = Router();

documentRouter.use("/", verifyToken, verifyUserExists);
documentRouter.post(
  "/",
  validateBody(documentCreateSchema),
  (req: Request, res: Response) => {
    documentController.create(req, res);
  }
);
