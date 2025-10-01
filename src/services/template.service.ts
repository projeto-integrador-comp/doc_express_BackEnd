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

export class TemplateService {
  private storageService: StorageService;
  private templateRepository = AppDataSource.getRepository(Template);

  constructor() {
    this.storageService = new StorageService();
  }

  // Criar template com upload para o bucket
  async createWithUpload(uploadData: ITemplateUploadData): Promise<Template> {
    const bucketName = process.env.SUPABASE_BUCKET_TEMPLATES || "templates";

    try {
      // 1. Upload do arquivo para o bucket
      const fileUrl = await this.storageService.uploadFileBuffer(
        bucketName,
        uploadData.fileBuffer,
        uploadData.fileName,
        uploadData.mimeType
      );

      // 2. Cria o registro do template no banco
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
      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: string }).message
          : String(error);
      throw new AppError(`Failed to upload template: ${errorMessage}`, 500);
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

    // Remove arquivo do bucket antes de desativar
    if (template.fileUrl) {
      try {
        const bucketName = process.env.SUPABASE_BUCKET_TEMPLATES || "templates";
        await this.storageService.deleteFile(bucketName, template.fileName);
      } catch (error) {
        console.error("Error deleting file from bucket:", error);
        // Não lança erro para não impedir a exclusão do registro
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
    if (!template) {
      throw new AppError("Template not found", 404);
    }

    if (!template.fileUrl) {
      throw new AppError("File not available", 404);
    }

    try {
      const bucketName = process.env.SUPABASE_BUCKET_TEMPLATES || "templates";

      // Extrai nome do arquivo da URL do Supabase
      const fileNameFromUrl = this.extractFileNameFromUrl(template.fileUrl);
      const fileName = fileNameFromUrl || template.fileName;

      console.log("🔍 Download debug:", {
        fileUrl: template.fileUrl,
        fileNameInDb: template.fileName,
        fileNameInSupabase: fileNameFromUrl,
        usingFileName: fileName,
      });

      const buffer = await this.storageService.downloadFile(bucketName, fileName);
      return { buffer, template };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new AppError(`Failed to download file: ${errorMessage}`, 500);
    }
  }

  // Método auxiliar para extrair nome do arquivo da URL
  private extractFileNameFromUrl(fileUrl: string): string | null {
    try {
      const url = new URL(fileUrl);
      const pathParts = url.pathname.split("/");
      return pathParts[pathParts.length - 1];
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
