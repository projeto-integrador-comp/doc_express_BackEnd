import { Request, Response } from "express";
import { TemplateService } from "../services/template.service";
import {
  TTemplateCreate,
  TTemplateUpdate,
} from "../interfaces/template.interface";
import { AppError } from "../errors/AppError.error";

export class TemplateController {
  constructor(private templateService: TemplateService) {}

  async create(req: Request, res: Response) {
    try {
      const reqBody: TTemplateCreate = req.body;
      const newTemplate = await this.templateService.create(reqBody);
      return res.status(201).json(newTemplate);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(400).json({ error: "Error creating template" });
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
    try {
      const { id } = req.params;
      const template = await this.templateService.readOne(id);

      if (!template) {
        throw new AppError("Template not found", 404);
      }

      res.setHeader("Content-Type", template.mimeType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${template.fileName}"`
      );
      res.setHeader("Content-Length", template.fileSize.toString());

      return res.json({
        message: "Download endpoint ready - file streaming to be implemented",
        template,
      });
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
