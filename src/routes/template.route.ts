// routes/template.routes.ts
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
import { upload } from "../config/multer.config";
import { AppDataSource } from "../data-source";
import { Template } from "../entities/template.entity";

export const templateRouter: Router = Router();
const templateService = new TemplateService();
const templateController = new TemplateController(templateService);

// 🔍 Verifica se o Supabase está configurado
const hasSupabase = process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY;

// ===================== PUBLIC ROUTES =====================

// DOWNLOAD
templateRouter.get("/:id/download", (req, res) => {
  templateController.download(req, res);
});

// CREATE - Upload de template
templateRouter.post(
  "/",
  upload.single("file"),
  validateBody(templateUploadSchema),
  async (req, res) => {
    try {
      const { name, description } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "Arquivo obrigatório" });
      }

      // ⚙️ Se Supabase não está configurado → salva local
      if (!hasSupabase) {
        console.warn("⚠️ Supabase não configurado. Salvando localmente...");

        const templateRepo = AppDataSource.getRepository(Template);
        const template = templateRepo.create({
          name,
          description,
          fileName: file.filename,
          fileSize: file.size,
          mimeType: file.mimetype,
          fileUrl: `/uploads/${file.filename}`,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await templateRepo.save(template);
        return res.status(201).json(template);
      }

      // 🔥 Supabase configurado → usa controller normal
      await templateController.create(req, res);
    } catch (err) {
      console.error("Erro ao salvar template:", err);
      res.status(500).json({ message: "Erro ao salvar template" });
    }
  }
);

// READ - Listar todos templates
templateRouter.get("/", verifyToken, validateToken, (req, res) => {
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

// ===================== PROTECTED ROUTES =====================

templateRouter.use(verifyToken, validateToken, verifyAdimn);

// UPDATE
templateRouter.patch("/:id", validateBody(templateUpdateSchema), (req, res) => {
  templateController.update(req, res);
});

// DELETE
templateRouter.delete("/:id", (req, res) => {
  templateController.remove(req, res);
});

export default templateRouter;
