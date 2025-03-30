import { User } from "../entities/user.entity";
import { TDocument, TDocumentCreate } from "../interfaces/document.interface";
import { documentRepository } from "../repositories";
import { documentSchema } from "../schemas/document.schema";

export class DocumentService {
  async create(data: TDocumentCreate, user: User): Promise<TDocument> {
    const newDocument = documentRepository.create({ ...data, user });
    await documentRepository.save(newDocument);

    return documentSchema.parse(newDocument);
  }
}
