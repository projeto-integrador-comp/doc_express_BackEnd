import { createClient, SupabaseClient } from "@supabase/supabase-js";

export default class StorageService {
  private client: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_KEY!;

    if (!url || !key) {
      throw new Error("Supabase URL and KEY are required");
    }

    this.client = createClient(url, key);
  }

  async uploadFileBuffer(
    bucket: string,
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<string> {
    const uniqueFileName = `${Date.now()}-${fileName}`;

    const { error } = await this.client.storage
      .from(bucket)
      .upload(uniqueFileName, fileBuffer, {
        contentType: mimeType,
        upsert: false,
        cacheControl: "3600",
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = this.client.storage.from(bucket).getPublicUrl(uniqueFileName);

    return publicUrl;
  }

  async downloadFile(bucket: string, fileName: string): Promise<Buffer> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .download(fileName);

    if (error || !data) {
      throw new Error(`Download failed: ${error?.message}`);
    }

    return Buffer.from(await data.arrayBuffer());
  }

  async deleteFile(bucket: string, fileName: string): Promise<void> {
    const { error } = await this.client.storage.from(bucket).remove([fileName]);
    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  async fileExists(bucket: string, fileName: string): Promise<boolean> {
    const { data } = await this.client.storage
      .from(bucket)
      .list("", { search: fileName });

    return !!data?.some((file) => file.name === fileName);
  }
}
