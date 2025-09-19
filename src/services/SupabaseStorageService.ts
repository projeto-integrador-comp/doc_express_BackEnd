import { createClient, SupabaseClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

export class SupabaseStorageService {
  private client: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_KEY!;
    this.client = createClient(url, key);
  }

  async uploadFile(bucket: string, filePath: string): Promise<string> {
    const fileName = path.basename(filePath);
    const fileBuffer = fs.readFileSync(filePath);

    const { error } = await this.client.storage
      .from(bucket)
      .upload(fileName, fileBuffer, { upsert: true });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    const { data } = this.client.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  }

  async downloadFile(bucket: string, fileName: string): Promise<Buffer> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .download(fileName);

    if (error || !data) {
      throw new Error(`Download failed: ${error?.message}`);
    }

    const buffer = Buffer.from(await data.arrayBuffer());
    return buffer;
  }

  async deleteFile(bucket: string, fileName: string): Promise<void> {
    const { error } = await this.client.storage.from(bucket).remove([fileName]);
    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  }
}
