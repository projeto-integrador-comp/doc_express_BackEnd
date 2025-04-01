import { Request, Response } from "express";
import { DocumentService } from "../services/document.service";

export class DocumentController {
  constructor(private documentService: DocumentService) {}

  async create(req: Request, res: Response) {
    const { foundUser } = res.locals;
    const newDocument = await this.documentService.create(req.body, foundUser);
    return res.status(201).json(newDocument);
  }

  async read(req: Request, res: Response) {
    const { foundUser } = res.locals;
    const documents = await this.documentService.read(foundUser);

    return res.json(documents);
  }

  async update(req: Request, res: Response) {
    const { foundDocument } = res.locals;
    const documentUpdated = await this.documentService.update(
      foundDocument,
      req.body
    );

    return res.json(documentUpdated);
  }

  async remove(req: Request, res: Response) {
    const { foundDocument } = res.locals;
    await this.documentService.remove(foundDocument);

    return res.status(204).json();
  }
}
