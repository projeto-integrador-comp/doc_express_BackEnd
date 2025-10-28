import { Template } from "../entities/template.entity";
import { AppDataSource } from "../data-source";
import {
  TTemplateCreate,
  TTemplateUpdate,
  ITemplateUploadData,
} from "../interfaces/template.interface";
import { ILike } from "typeorm";
import { AppError } from "../errors/AppError.error";
import StorageService from "../services/storage.service";
import fs from "fs";
import path from "path";

export class TemplateService {
  private storageService: StorageService;
  private templateRepository = AppDataSource.getRepository(Template);
  private useSupabase: boolean;

  constructor() {
    this.storageService = new StorageService();
    this.useSupabase = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_KEY;
  }

  async createWithUpload(uploadData: ITemplateUploadData): Promise<Template> {
    try {
      let fileUrl: string;

      if (this.useSupabase) {
        // --- Upload via Supabase ---
        const bucketName = process.env.SUPABASE_BUCKET_TEMPLATES || "templates";
        fileUrl = await this.storageService.uploadFileBuffer(
          bucketName,
          uploadData.fileBuffer,
          uploadData.fileName,
          uploadData.mimeType
        );
      } else {
        // --- Upload local (sem Supabase) ---
        const uploadDir = path.resolve("uploads/templates");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const localPath = path.join(uploadDir, uploadData.fileName);
        fs.writeFileSync(localPath, uploadData.fileBuffer);

        // Caminho acessível (ex: se o Express servir /uploads)
        fileUrl = `/uploads/templates/${uploadData.fileName}`;
      }

      // Criação do registro no banco
      const templateData: TTemplateCreate = {
        name: uploadData.name,
        description: uploadData.description,
        fileName: uploadData.fileName,
        fileSize: uploadData.fileSize,
        mimeType: uploadData.mimeType,
        isActive: true,
      };

      const template = this.templateRepository.create({
        ...templateData,
        fileUrl,
      });

      return await this.templateRepository.save(template);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new AppError(`Failed to upload template: ${message}`, 500);
    }
  }

  async create(templateData: TTemplateCreate): Promise<Template> {
    const template = this.templateRepository.create(templateData);
    return await this.templateRepository.save(template);
  }

  async read(): Promise<Template[]> {
    return await this.templateRepository.find({
      where: { isActive: true },
      order: { createdAt: "DESC" },
    });
  }

  async readOne(id: string): Promise<Template | null> {
    return await this.templateRepository.findOne({
      where: { id, isActive: true },
    });
  }

  async update(id: string, templateData: TTemplateUpdate): Promise<Template> {
    await this.templateRepository.update(id, {
      ...templateData,
      updatedAt: new Date(),
    });

    const updatedTemplate = await this.templateRepository.findOneBy({ id });
    if (!updatedTemplate) throw new AppError("Template not found", 404);

    return updatedTemplate;
  }

  async remove(id: string): Promise<void> {
    const template = await this.readOne(id);
    if (!template) throw new AppError("Template not found", 404);

    // Remoção do arquivo (Supabase ou local)
    if (template.fileUrl) {
      try {
        if (this.useSupabase) {
          const bucketName =
            process.env.SUPABASE_BUCKET_TEMPLATES || "templates";
          await this.storageService.deleteFile(bucketName, template.fileName);
        } else {
          const localPath = path.resolve(
            "uploads/templates",
            template.fileName
          );
          if (fs.existsSync(localPath)) {
            fs.unlinkSync(localPath);
          }
        }
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }

    await this.templateRepository.update(id, {
      isActive: false,
      updatedAt: new Date(),
    });
  }

  async downloadFile(
    id: string
  ): Promise<{ buffer: Buffer; template: Template }> {
    const template = await this.readOne(id);
    if (!template) throw new AppError("Template not found", 404);

    if (!template.fileUrl) throw new AppError("File not available", 404);

    try {
      let buffer: Buffer;

      if (this.useSupabase) {
        const bucketName = process.env.SUPABASE_BUCKET_TEMPLATES || "templates";
        const fileNameFromUrl = this.extractFileNameFromUrl(template.fileUrl);
        const fileName = fileNameFromUrl || template.fileName;

        buffer = await this.storageService.downloadFile(bucketName, fileName);
      } else {
        const localPath = path.resolve("uploads/templates", template.fileName);
        if (!fs.existsSync(localPath)) {
          throw new AppError("Local file not found", 404);
        }
        buffer = fs.readFileSync(localPath);
      }

      return { buffer, template };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new AppError(`Failed to download file: ${message}`, 500);
    }
  }

  private extractFileNameFromUrl(fileUrl: string): string | null {
    try {
      const decodedPath = decodeURIComponent(new URL(fileUrl).pathname);
      return decodedPath.split("/").pop() || null;
    } catch {
      return null;
    }
  }

  async readByMimeType(mimeType: string): Promise<Template[]> {
    return await this.templateRepository.find({
      where: { mimeType, isActive: true },
      order: { createdAt: "DESC" },
    });
  }

  async search(query: string): Promise<Template[]> {
    return await this.templateRepository.find({
      where: [
        { name: ILike(`%${query}%`), isActive: true },
        { description: ILike(`%${query}%`), isActive: true },
      ],
      order: { createdAt: "DESC" },
    });
  }
}

export default TemplateService;
