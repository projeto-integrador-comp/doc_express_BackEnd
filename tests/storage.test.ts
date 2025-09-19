import { SupabaseStorageService } from "../src/services/SupabaseStorageService";
import path from "path";
import fs from "fs";

describe("SupabaseStorageService", () => {
  const service = new SupabaseStorageService();

  it("should upload a file and return a public URL", async () => {
    const filePath = path.join(__dirname, "fixtures", "sample.txt");
    fs.writeFileSync(filePath, "test content");

    const result = await service.uploadFile("templates", filePath);

    expect(result).toMatch(/^http/); // we expect a URL starting with http

    fs.unlinkSync(filePath);
  });
});
