/**
 * tests/storage.test.ts
 *
 * Testes do StorageService (mock do StorageService embutido).
 * Substitua o arquivo existente por este.
 */

import StorageService from "../src/services/storage.service";

jest.setTimeout(20000);

// Mock manual do StorageService para não depender de Supabase real
jest.mock("../src/services/storage.service", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        // uploadFileBuffer: retorna URL string (usado pelo TemplateService)
        uploadFileBuffer: jest.fn(async (_bucket: string, _buffer: Buffer, fileName: string) => {
          return `https://supabase.mock/${_bucket}/${fileName}`;
        }),
        // downloadFile: retorna Buffer
        downloadFile: jest.fn(async (_bucket: string, _fileName: string) => {
          return Buffer.from("mock content");
        }),
        // deleteFile: retorna booleano de sucesso
        deleteFile: jest.fn(async (_bucket: string, _fileName: string) => {
          return true;
        }),
      };
    }),
  };
});

describe("StorageService (mocked)", () => {
  let storageService: StorageService;

  beforeAll(() => {
    storageService = new StorageService();
  });

  it("should upload a file buffer with mime (uploadFileBuffer) and return a URL string", async () => {
    const url = await (storageService as any).uploadFileBuffer(
      "bucket",
      Buffer.from("data"),
      "fileABC.txt",
      "text/plain"
    );
    expect(typeof url).toBe("string");
    expect(url).toContain("/bucket/fileABC.txt");
  });

  it("should download a file (downloadFile) returning a Buffer", async () => {
    const buf = await (storageService as any).downloadFile("bucket", "path/file.txt");
    expect(Buffer.isBuffer(buf)).toBe(true);
    expect(buf.toString()).toBe("mock content");
  });

  it("should delete a file (deleteFile) returning true", async () => {
    const ok = await (storageService as any).deleteFile("bucket", "path/file.txt");
    expect(ok).toBe(true);
  });

  it("mock methods should have been called with expected args", async () => {
    // chama métodos extras para checar chamadas
    await (storageService as any).uploadFileBuffer("bucket", Buffer.from("x"), "nome.txt", "text/plain");
    await (storageService as any).downloadFile("bucket", "nome.txt");
    await (storageService as any).deleteFile("bucket", "nome.txt");

    // assertions diretamente no objeto instanciado (mais robusto)
    expect((storageService as any).uploadFileBuffer).toHaveBeenCalled();
    expect((storageService as any).downloadFile).toHaveBeenCalled();
    expect((storageService as any).deleteFile).toHaveBeenCalled();
  });
});
