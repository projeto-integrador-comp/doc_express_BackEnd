import { User } from "../entities/user.entity";
import {
  TDocument,
  TDocumentCreate,
  TDocumentList,
  TDocumentUpdate,
} from "../interfaces/document.interface";
import { documentRepository } from "../repositories";
import {
  documentListSchema,
  documentReturnSchema,
  documentSchema,
} from "../schemas/document.schema";
import { Document } from "../entities/document.entity";
import StorageService from "../services/storage.service";

const storage = new StorageService();

export class DocumentService {
  async create(data: TDocumentCreate, user: User): Promise<TDocument> {
    const newDocument = documentRepository.create({ ...data, user });
    await documentRepository.save(newDocument);

    return documentReturnSchema.parse(newDocument);
  }

  async read(user: User): Promise<TDocumentList> {
    const documents = await documentRepository.find({ where: { user } });
    return documentListSchema.parse(documents);
  }

  async update(document: Document, data: TDocumentUpdate): Promise<TDocument> {
    const documentUpdated = documentRepository.create({ ...document, ...data });
    await documentRepository.save(documentUpdated);

    const { submissionDate } = data;
    if (submissionDate) return documentReturnSchema.parse(documentUpdated);

    return documentSchema.parse(documentUpdated);
  }

  async remove(document: Document): Promise<void> {
    await documentRepository.remove(document);
  }

  // === Novo método: upload de anexo ===
  async uploadAttachment(document: Document, file: Express.Multer.File): Promise<TDocument> {
    const bucket = process.env.SUPABASE_BUCKET_DOCUMENTS || "documents";

    // Faz upload para o Supabase via buffer
    const fileUrl = await storage.uploadFileBuffer(
      bucket,
      file.buffer,
      file.originalname,
      file.mimetype
    );

    // Atualiza entidade Document
    document.fileUrl = fileUrl;
    document.fileName = file.originalname;
    document.mimeType = file.mimetype;
    document.fileSize = file.size;
    document.fileUploadedAt = new Date();

    await documentRepository.save(document);

    return documentReturnSchema.parse(document);
  }
}
