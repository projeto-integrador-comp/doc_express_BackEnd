// tests/storage.test.ts
import { SupabaseStorageService } from "../src/services/SupabaseStorageService";
import fs from "fs";
import path from "path";

describe("SupabaseStorageService (DEV-001)", () => {
  const service = new SupabaseStorageService();
  const testBucket = process.env.SUPABASE_BUCKET_TEMPLATES || "templates";
  const testFilePath = path.join(__dirname, "fixtures", "test-file.txt");
  const testFileName = "test-file.txt";

  beforeAll(() => {
    // garantir que o arquivo de teste exista
    const fixturesDir = path.join(__dirname, "fixtures");
    if (!fs.existsSync(fixturesDir)) {
      fs.mkdirSync(fixturesDir);
    }
    fs.writeFileSync(testFilePath, "conteúdo de teste");
  });

  afterAll(() => {
    // limpar o arquivo local após os testes
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  it("should upload a file and return a public URL", async () => {
    const url = await service.uploadFile(testBucket, testFilePath);
    expect(url).toContain("https://"); // deve retornar uma URL pública
  });

  it("should download a file that was previously uploaded", async () => {
    const buffer = await service.downloadFile(testBucket, testFileName);
    expect(buffer.toString()).toBe("conteúdo de teste");
  });

  it("should delete a file and make it unavailable", async () => {
    await service.deleteFile(testBucket, testFileName);

    // depois de deletado, o download deve falhar
    await expect(service.downloadFile(testBucket, testFileName)).rejects.toThrow();
  });
});
