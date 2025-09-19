import { Router } from "express";
import { TemplateController } from "../controllers/template.controller";
import { TemplateService } from "../services/template.service";
import { validateBody } from "../middlewares/validateBody.middleware";
import {
  templateUploadSchema,
  templateUpdateSchema,
} from "../schemas/template.schema";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { validateToken } from "../middlewares/validatetoken.middleware";
import { verifyAdimn } from "../middlewares/verifyAdimin.middleware";

export const templateRouter: Router = Router();
const templateService = new TemplateService();
const templateController = new TemplateController(templateService);

// Rotas públicas (download)
templateRouter.get("/:id/download", (req, res) => {
  templateController.download(req, res);
});

// Rotas protegidas (CRUD) - requerem autenticação e admin
templateRouter.use(verifyToken, validateToken, verifyAdimn);

// CREATE - Upload de template
templateRouter.post("/", validateBody(templateUploadSchema), (req, res) => {
  templateController.create(req, res);
});

// READ - Listar todos templates
templateRouter.get("/", (req, res) => {
  templateController.read(req, res);
});

// READ - Buscar templates (com filtros)
templateRouter.get("/search", (req, res) => {
  templateController.search(req, res);
});

// READ - Obter template específico
templateRouter.get("/:id", (req, res) => {
  templateController.readOne(req, res);
});

// UPDATE - Atualizar template
templateRouter.patch("/:id", validateBody(templateUpdateSchema), (req, res) => {
  templateController.update(req, res);
});

// DELETE - Remover template
templateRouter.delete("/:id", (req, res) => {
  templateController.remove(req, res);
});

export default templateRouter;
