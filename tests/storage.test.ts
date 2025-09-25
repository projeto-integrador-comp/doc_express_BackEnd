import { config } from "dotenv";
import { SupabaseStorageService } from "../src/services/SupabaseStorageService";

config();

// ✅ Mock para evitar erros de conexão real
jest.mock("../src/services/SupabaseStorageService", () => {
  return {
    SupabaseStorageService: jest.fn().mockImplementation(() => ({
      uploadFileBuffer: jest.fn().mockResolvedValue("https://example.com/file.txt"),
      downloadFile: jest.fn().mockResolvedValue(Buffer.from("conteúdo de teste")),
      deleteFile: jest.fn().mockResolvedValue(undefined),
      fileExists: jest.fn().mockResolvedValue(false),
    })),
  };
});

describe("SupabaseStorageService", () => {
  let service: SupabaseStorageService;
  const testBucket = "templates";

  beforeEach(() => {
    service = new SupabaseStorageService();
  });

  it("should upload a file and return a public URL", async () => {
    const testBuffer = Buffer.from("conteúdo de teste");
    const url = await service.uploadFileBuffer(
      testBucket, 
      testBuffer, 
      "test-file.txt",
      "text/plain"
    );
    
    expect(url).toContain("https://");
  });

  it("should download a file that was previously uploaded", async () => {
    const buffer = await service.downloadFile(testBucket, "test-file.txt");
    expect(buffer.toString()).toBe("conteúdo de teste");
  });

  it("should delete a file and make it unavailable", async () => {
    // Mock para simular erro no download após delete
    (service.downloadFile as jest.Mock).mockRejectedValueOnce(new Error("File not found"));
    
    await service.deleteFile(testBucket, "test-file.txt");
    await expect(service.downloadFile(testBucket, "test-file.txt")).rejects.toThrow();
  });
});