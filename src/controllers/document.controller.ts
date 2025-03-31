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
}
