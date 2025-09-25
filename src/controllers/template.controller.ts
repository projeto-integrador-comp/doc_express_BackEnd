import { Request, Response } from "express";
import { TemplateService } from "../services/template.service";
import {
  TAllowedMimeTypes,
  TTemplateCreate,
  TTemplateUpdate,
  ITemplateUploadData,
} from "../interfaces/template.interface";
import { AppError } from "../errors/AppError.error";
import fs from "fs";
import path from "path";
import z from "zod";
import { templateUploadSchema } from "../schemas/template.schema";

export class TemplateController {
  constructor(private templateService: TemplateService) {}

  async create(req: Request, res: Response) {
    // try {
    //   if (!req.file) {
    //     throw new AppError("Nenhum arquivo enviado", 400);
    //   }

    //   // Crie um objeto completo para validação Zod
    //   const completeBody = {
    //     ...req.body,
    //     fileName: req.file.originalname,
    //     fileSize: req.file.size,
    //     mimeType: req.file.mimetype,
    //   };

    //   // Valide o objeto COMPLETO com Zod
    //   const validatedData = templateUploadSchema.parse(completeBody);

    //   // Agora crie os dados do template
    //   const templateData: TTemplateCreate = {
    //     name: validatedData.name,
    //     description: validatedData.description,
    //     fileName: req.file.originalname,
    //     filePath: req.file.path,
    //     fileSize: req.file.size,
    //     mimeType: req.file.mimetype as TAllowedMimeTypes,
    //     isActive: true,
    //   };

    //   const newTemplate = await this.templateService.create(templateData);
    //   return res.status(201).json(newTemplate);
    // } catch (error) {
    //   if (error instanceof AppError) {
    //     return res.status(error.statusCode).json({ error: error.message });
    //   }

    //   // Capture erros de validação do Zod
    //   if (error instanceof z.ZodError) {
    //     return res.status(400).json({ error: error.errors });
    //   }

    //   return res.status(400).json({ error: "Error creating template" });
    // }
    try {
      if (!req.file) {
        throw new AppError("Nenhum arquivo enviado", 400);
      }

      // Validação dos dados do formulário
      const validatedData = templateUploadSchema.parse(req.body);

      // Prepara os dados para upload
      const uploadData: ITemplateUploadData = {
        name: validatedData.name,
        description: validatedData.description,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype as TAllowedMimeTypes,
        fileBuffer: req.file.buffer, // Agora usamos o buffer em memória
      };

      // Usa o novo método que faz upload para o bucket
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

      return res.status(500).json({ error: "Error creating template" });
    }
  }

  async read(req: Request, res: Response) {
    try {
      const templates = await this.templateService.read();
      return res.json(templates);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async readOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const template = await this.templateService.readOne(id);

      if (!template) {
        throw new AppError("Template not found", 404);
      }

      return res.json(template);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const template = await this.templateService.update(id, req.body);
      return res.json(template);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(400).json({ error: "Error updating template" });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.templateService.remove(id);
      return res.status(204).json();
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async download(req: Request, res: Response) {
    //
    try {
      const { id } = req.params;

      // Obtém o arquivo do bucket
      const { buffer, template } = await this.templateService.downloadFile(id);

      // Configura headers para download
      res.setHeader("Content-Type", template.mimeType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${template.fileName}"`
      );
      res.setHeader("Content-Length", buffer.length.toString());

      // Envia o buffer diretamente
      return res.send(buffer);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
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
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
