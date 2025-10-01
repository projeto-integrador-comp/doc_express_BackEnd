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

  // === Upload de anexo ===
  async uploadAttachment(req: Request, res: Response) {
    const { foundDocument } = res.locals;
    const file = req.file as Express.Multer.File | undefined;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const updatedDocument = await this.documentService.uploadAttachment(
        foundDocument,
        file
      );

      return res.status(200).json(updatedDocument);
    } catch (error: any) {
      console.error("Error uploading attachment:", error);
      return res.status(500).json({
        message: "Failed to upload attachment",
        error: error.message ?? error,
      });
    }
  }
}
