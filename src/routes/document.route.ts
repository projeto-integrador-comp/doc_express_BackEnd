import { Request, Response, Router } from "express";
import multer from "multer";
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

// Configuração do multer (usa memória, porque enviaremos direto ao Supabase)
const upload = multer({ storage: multer.memoryStorage() });

// === Rotas protegidas ===
documentRouter.use("/", verifyToken, verifyUserExists);

// Criar documento
documentRouter.post(
  "/",
  validateBody(documentCreateSchema),
  (req: Request, res: Response) => {
    documentController.create(req, res);
  }
);

// Listar documentos do usuário
documentRouter.get("/", (req: Request, res: Response) => {
  documentController.read(req, res);
});

// Middlewares aplicados às rotas com :id
documentRouter.use("/:id", verifyOwnerDocument);

// Atualizar documento
documentRouter.patch(
  "/:id",
  validateBody(documentUpdateSchema),
  (req: Request, res: Response) => {
    documentController.update(req, res);
  }
);

// Deletar documento
documentRouter.delete("/:id", (req: Request, res: Response) => {
  documentController.remove(req, res);
});

// Upload de anexo para documento
documentRouter.post(
  "/:id/attachment",
  upload.single("file"),
  (req: Request, res: Response) => {
    documentController.uploadAttachment(req, res);
  }
);
