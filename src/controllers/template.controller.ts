import { Request, Response } from "express";
import { TemplateService } from "../services/template.service";
import {
  TAllowedMimeTypes,
  ITemplateUploadData,
} from "../interfaces/template.interface";
import { AppError } from "../errors/AppError.error";
import z from "zod";
import { templateUploadSchema } from "../schemas/template.schema";
import { AppDataSource } from "../data-source";
import { Template } from "../entities/template.entity";
import path from "path";
import fs from "fs";

export class TemplateController {
  constructor(private templateService: TemplateService) {}

  async create(req: Request, res: Response) {
    try {
      if (!req.file) {
        throw new AppError("Nenhum arquivo enviado", 400);
      }

      // Validação dos dados do formulário
      const validatedData = templateUploadSchema.parse(req.body);

      const hasSupabase =
        process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY;

      if (!hasSupabase) {
        // ==============================
        // 🔹 SALVA LOCALMENTE (sem Supabase)
        // ==============================
        console.warn("⚠️ Supabase não configurado. Salvando localmente...");

        const uploadDir = path.resolve(__dirname, "../../uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, req.file.originalname);
        fs.writeFileSync(filePath, req.file.buffer);

        const templateRepo = AppDataSource.getRepository(Template);
        const template = templateRepo.create({
          name: validatedData.name,
          description: validatedData.description,
          fileName: req.file.originalname,
          fileSize: req.file.size,
          mimeType: req.file.mimetype as TAllowedMimeTypes,
          fileUrl: `/uploads/${req.file.originalname}`,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await templateRepo.save(template);
        return res.status(201).json(template);
      }

      // ==============================
      // 🔹 SALVA NO SUPABASE (configurado)
      // ==============================
      const uploadData: ITemplateUploadData = {
        name: validatedData.name,
        description: validatedData.description,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype as TAllowedMimeTypes,
        fileBuffer: req.file.buffer,
      };

      const newTemplate = await this.templateService.createWithUpload(
        uploadData
      );
      return res.status(201).json(newTemplate);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }

      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }

      console.error("Erro ao criar template:", error);
      return res.status(500).json({ error: "Erro interno ao criar template" });
    }
  }

  async read(req: Request, res: Response) {
    try {
      const templates = await this.templateService.read();
      return res.json(templates);
    } catch (error) {
      if (error instanceof AppError)
        return res.status(error.statusCode).json({ error: error.message });

      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async readOne(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // 1. CORREÇÃO DO ERRO DE TIPO:
 // Verificamos se 'id' não é uma string única. Se for undefined ou array, barramos aqui.
 if (typeof id !== 'string') {
   throw new AppError("User not found.", 404);
 }

      const template = await this.templateService.readOne(id);

      if (!template) {
        throw new AppError("Template not found", 404);
      }

      return res.json(template);
    } catch (error) {
      if (error instanceof AppError)
        return res.status(error.statusCode).json({ error: error.message });

      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // 1. CORREÇÃO DO ERRO DE TIPO:
 // Verificamos se 'id' não é uma string única. Se for undefined ou array, barramos aqui.
 if (typeof id !== 'string') {
   throw new AppError("Student not found.", 404);
 }

      const template = await this.templateService.update(id, req.body);
      return res.json(template);
    } catch (error) {
      if (error instanceof AppError)
        return res.status(error.statusCode).json({ error: error.message });

      return res.status(400).json({ error: "Error updating template" });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // 1. CORREÇÃO DO ERRO DE TIPO:
 // Verificamos se 'id' não é uma string única. Se for undefined ou array, barramos aqui.
 if (typeof id !== 'string') {
   throw new AppError("User not found.", 404);
 }

      await this.templateService.remove(id);
      return res.status(204).json();
    } catch (error) {
      if (error instanceof AppError)
        return res.status(error.statusCode).json({ error: error.message });

      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async download(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // 1. CORREÇÃO DO ERRO DE TIPO:
 // Verificamos se 'id' não é uma string única. Se for undefined ou array, barramos aqui.
 if (typeof id !== 'string') {
   throw new AppError("Student not found.", 404);
 }
 
      const { buffer, template } = await this.templateService.downloadFile(id);

      res.setHeader("Content-Type", template.mimeType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${template.fileName}"`
      );
      res.setHeader("Content-Length", buffer.length.toString());

      return res.send(buffer);
    } catch (error) {
      if (error instanceof AppError)
        return res.status(error.statusCode).json({ error: error.message });

      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async search(req: Request, res: Response) {
    try {
      const { q, type } = req.query;

      let templates;
      if (type) {
        templates = await this.templateService.readByMimeType(type as string);
      } else if (q) {
        templates = await this.templateService.search(q as string);
      } else {
        templates = await this.templateService.read();
      }

      return res.json(templates);
    } catch (error) {
      if (error instanceof AppError)
        return res.status(error.statusCode).json({ error: error.message });

      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
