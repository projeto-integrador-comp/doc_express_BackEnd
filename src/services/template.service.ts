import { Template } from "../entities/template.entity";
import { AppDataSource } from "../data-source";
import {
  TTemplateCreate,
  TTemplateUpdate,
} from "../interfaces/template.interface";
import { ILike } from "typeorm";

export class TemplateService {
  private templateRepository = AppDataSource.getRepository(Template);

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
    if (!updatedTemplate) throw new Error("Template not found");

    return updatedTemplate;
  }

  async remove(id: string): Promise<void> {
    await this.templateRepository.update(id, {
      isActive: false,
      updatedAt: new Date(),
    });
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
