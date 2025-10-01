import request from "supertest";
import app from "../src/app"; 
import { Document } from "../src/entities/document.entity";

describe("Document with attachment", () => {
  it("should have attachment fields in the entity", () => {
    const document = new Document();

    expect(document).toHaveProperty("fileUrl", null);
    expect(document).toHaveProperty("fileName", null);
    expect(document).toHaveProperty("mimeType", null);
    expect(document).toHaveProperty("fileSize", null);
    expect(document).toHaveProperty("fileUploadedAt", null);
  });

  it("should allow uploading an attachment to a Document", async () => {
    const fakeUserToken = "token"; // placeholder, será substituído por auth real

    const response = await request(app)
      .post("/documents/1/upload")
      .set("Authorization", `Bearer ${fakeUserToken}`)
      .attach("file", Buffer.from("dummy content"), "dummy.pdf");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("fileUrl");
    expect(response.body).toHaveProperty("fileName", "dummy.pdf");
    expect(response.body).toHaveProperty("mimeType");
    expect(response.body).toHaveProperty("fileSize");
    expect(response.body).toHaveProperty("fileUploadedAt");
  });
});
