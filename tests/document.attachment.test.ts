/**
 * tests/document.attachment.test.ts
 *
 * Testa o fluxo de upload/listagem/download/delete por rotas HTTP,
 * montando um app Express de teste independente (sem middlewares de auth).
 * Usa o mesmo TemplateService do projeto e mocka o StorageService.
 */

import express, { Request, Response } from "express";
import request from "supertest";
import multer from "multer";
import { AppDataSource } from "../src/data-source";
import TemplateService from "../src/services/template.service";
import { Template } from "../src/entities/template.entity";

jest.setTimeout(30000);

// Mock do StorageService para evitar Supabase real
jest.mock("../src/services/storage.service", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        uploadFile: jest.fn(async (_bucket: string, _path: string, _buffer: Buffer) => {
          return { path: `https://supabase.mock/${_bucket}/${_path}` };
        }),
        uploadFileBuffer: jest.fn(async (_bucket: string, _buffer: Buffer, fileName: string) => {
          return `https://supabase.mock/${_bucket}/${fileName}`;
        }),
        downloadFile: jest.fn(async (_bucket: string, _fileName: string) => Buffer.from("mock content")),
        deleteFile: jest.fn(async () => true),
      };
    }),
  };
});

describe("Document/Template Attachment routes (test app sem auth)", () => {
  let app: express.Express;
  let templateService: TemplateService;
  let createdTemplateId: string | null = null;

  beforeAll(async () => {
    // Inicializa DB (ou reutiliza se já inicializado)
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
    } catch {
      // ignore se já inicializado
    }

    // Limpa templates para garantir determinismo
    const repo = AppDataSource.getRepository(Template);
    await repo.clear();

    // Monta app de teste
    app = express();
    app.use(express.json());

    const upload = multer(); // buffer memory storage
    templateService = new TemplateService();

    // POST /templates/upload
    app.post(
      "/templates/upload",
      upload.single("file"),
      async (req: Request, res: Response) => {
        try {
          const file = req.file;
          if (!file) {
            return res.status(400).json({ message: "file is required" });
          }

          const { name, description } = req.body as { name: string; description?: string };

          const created = await templateService.createWithUpload({
            name,
            description: description ?? null,
            fileName: file.originalname,
            fileSize: file.size,
            mimeType: file.mimetype,
            fileBuffer: file.buffer,
          } as any);

          return res.status(201).json(created);
        } catch (err: any) {
          return res.status(500).json({ message: err?.message ?? "upload failed" });
        }
      }
    );

    // GET /templates
    app.get("/templates", async (_req: Request, res: Response) => {
      try {
        const list = await templateService.read();
        return res.status(200).json(list);
      } catch (err: any) {
        return res.status(500).json({ message: err?.message ?? "list failed" });
      }
    });

    // GET /templates/:id/download
    app.get("/templates/:id/download", async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const { buffer, template } = await templateService.downloadFile(id);
        res.setHeader("Content-Type", template.mimeType || "application/octet-stream");
        res.status(200).send(buffer);
      } catch (err: any) {
        // Algumas implementações retornam 404/500; mantemos 404 se não existe.
        const code = /not found/i.test(err?.message) ? 404 : 500;
        res.status(code).json({ message: err?.message ?? "download failed" });
      }
    });

    // DELETE /templates/:id
    app.delete("/templates/:id", async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        await templateService.remove(id);
        return res.status(204).send();
      } catch (err: any) {
        const code = /not found/i.test(err?.message) ? 404 : 500;
        return res.status(code).json({ message: err?.message ?? "delete failed" });
      }
    });
  });

  afterAll(async () => {
    try {
      const repo = AppDataSource.getRepository(Template);
      await repo.clear();
      if (AppDataSource.isInitialized) await AppDataSource.destroy();
    } catch {
      // ignore
    }
  });

  it("POST /templates/upload should accept multipart/form-data and create template", async () => {
    const res = await request(app)
      .post("/templates/upload")
      .field("name", "Attachment Test Route")
      .field("description", "test route upload")
      .attach("file", Buffer.from("file content mock"), {
        filename: "route-test.txt",
        contentType: "text/plain",
      });

    expect([200, 201]).toContain(res.status); // normalmente 201
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("fileUrl");
    createdTemplateId = res.body.id;
  });

  it("GET /templates should list templates including the uploaded one", async () => {
    const res = await request(app).get("/templates");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const found = res.body.find((t: any) => t.name === "Attachment Test Route");
    expect(found).toBeTruthy();
  });

  it("GET /templates/:id/download should return a Buffer (200) or equivalent", async () => {
    if (!createdTemplateId) return;
    const res = await request(app).get(`/templates/${createdTemplateId}/download`);
    expect([200]).toContain(res.status); // nosso app de teste responde 200 com buffer
    expect(res.body).toBeDefined();
  });

  it("DELETE /templates/:id should soft-delete (204)", async () => {
    if (!createdTemplateId) return;

    const res = await request(app).delete(`/templates/${createdTemplateId}`);
    expect([204]).toContain(res.status);

    // conferir isActive=false
    const repo = AppDataSource.getRepository(Template);
    const t = await repo.findOneBy({ id: createdTemplateId });
    expect(t).toBeDefined();
    expect(t?.isActive).toBe(false);
  });
});
