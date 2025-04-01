import { Request, Response, Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { verifyUserExists } from "../middlewares/verifyUserExists.middleware";
import { validateBody } from "../middlewares/validateBody.middleware";
import {
  documentCreateSchema,
  documentUpdateSchema,
} from "../schemas/document.schema";
import { documentController } from "../controllers";
import { verifyOwnerDocument } from "../middlewares/verifyOwnerDocument.middleware";

export const documentRouter = Router();

documentRouter.use("/", verifyToken, verifyUserExists);
documentRouter.post(
  "/",
  validateBody(documentCreateSchema),
  (req: Request, res: Response) => {
    documentController.create(req, res);
  }
);
documentRouter.get("/", (req: Request, res: Response) => {
  documentController.read(req, res);
});

documentRouter.use("/:id", verifyToken, verifyUserExists, verifyOwnerDocument);
documentRouter.patch(
  "/:id",
  validateBody(documentUpdateSchema),
  (req: Request, res: Response) => {
    documentController.update(req, res);
  }
);
