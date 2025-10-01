/**
 * tests/template.test.ts
 *
 * Testes para TemplateService integrando com repositório (AppDataSource).
 * Substitua o arquivo existente por este.
 */

import TemplateService from "../src/services/template.service";
import { AppDataSource } from "../src/data-source";
import { Template } from "../src/entities/template.entity";
import { Repository } from "typeorm";

jest.setTimeout(20000);

// Mock manual do StorageService (mesmo comportamento do storage.test)
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
        downloadFile: jest.fn(async (_bucket: string, _fileName: string) => {
          return Buffer.from("mock content");
        }),
        deleteFile: jest.fn(async () => true),
      };
    }),
  };
});

describe("TemplateService (integration-like)", () => {
  let templateService: TemplateService;
  let repo: Repository<Template>;

  beforeAll(async () => {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
    } catch (e) {
      // se já inicializado por outro teste, ignore
    }

    repo = AppDataSource.getRepository(Template);
    templateService = new TemplateService();
    // limpa tabela de templates para testes determinísticos
    await repo.clear();
  });

  afterAll(async () => {
    try {
      await repo.clear();
      if (AppDataSource.isInitialized) await AppDataSource.destroy();
    } catch (e) {
      // ignore
    }
  });

  it("should create a template using create() (DB only)", async () => {
    const payload = {
      name: "Test create basic",
      description: "descr",
      fileName: "a.txt",
      mimeType: "text/plain",
      fileSize: 10,
      isActive: true,
    };

    const created = await templateService.create(payload as any);
    expect(created).toHaveProperty("id");
    expect(created.name).toBe("Test create basic");
  });

  it("should create a template with upload (createWithUpload) and persist fileUrl", async () => {
    const uploadData = {
      name: "Upload template",
      description: "upload test",
      fileName: "upload-1.txt",
      fileSize: 20,
      mimeType: "text/plain",
      fileBuffer: Buffer.from("conteudo"),
    };

    const created = await templateService.createWithUpload(uploadData as any);
    expect(created).toHaveProperty("id");
    expect(created.fileUrl).toContain("/templates/upload-1.txt");
  });

  it("should read() and return an array of active templates", async () => {
    const list = await templateService.read();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });

  it("should readOne() by id", async () => {
    const all = await templateService.read();
    const sample = all[0];
    const found = await templateService.readOne(sample.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(sample.id);
  });

  it("should update() a template", async () => {
    const all = await templateService.read();
    const sample = all[0];
    const changed = await templateService.update(sample.id, { name: "Renamed" } as any);
    expect(changed.name).toBe("Renamed");
  });

  it("should downloadFile() returning buffer and template", async () => {
    const all = await templateService.read();
    const sample = all[0];

    if (!sample.fileUrl) {
      await repo.update(sample.id, { fileUrl: `https://supabase.mock/templates/${sample.fileName}` });
    }

    const { buffer, template } = await templateService.downloadFile(sample.id);
    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.toString()).toBe("mock content");
    expect(template.id).toBe(sample.id);
  });

  it("should search() by name/description (case insensitive)", async () => {
    const res = await templateService.search("renamed");
    expect(Array.isArray(res)).toBe(true);
  });

  it("should readByMimeType()", async () => {
    const res = await templateService.readByMimeType("text/plain");
    expect(Array.isArray(res)).toBe(true);
  });

  it("should remove() (soft delete) and mark isActive false", async () => {
    const all = await templateService.read();
    const sample = all[0];
    await templateService.remove(sample.id);

    const removed = await repo.findOneBy({ id: sample.id });
    expect(removed).toBeDefined();
    expect(removed?.isActive).toBe(false);
  });
});
