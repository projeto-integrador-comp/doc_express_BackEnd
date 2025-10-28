import { createClient, SupabaseClient } from "@supabase/supabase-js";

export default class StorageService {
  private client: SupabaseClient | null = null;
  private mockMode: boolean = false;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;

    if (!url || !key) {
      console.warn(
        "[StorageService] Supabase não configurado — rodando em modo offline."
      );
      this.mockMode = true;
      return;
    }

    this.client = createClient(url, key);
  }

  async uploadFileBuffer(
    bucket: string,
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<string> {
    if (this.mockMode) {
      console.log(`[Mock] Upload de ${fileName} simulado.`);
      return `https://example.com/${bucket}/${fileName}`;
    }

    const uniqueFileName = `${Date.now()}-${fileName}`;

    const { error } = await this.client!.storage.from(bucket).upload(
      uniqueFileName,
      fileBuffer,
      {
        contentType: mimeType,
        upsert: false,
        cacheControl: "3600",
      }
    );

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = this.client!.storage.from(bucket).getPublicUrl(uniqueFileName);

    return publicUrl;
  }

  async downloadFile(bucket: string, fileName: string): Promise<Buffer> {
    if (this.mockMode) {
      console.log(`[Mock] Download de ${fileName} simulado.`);
      return Buffer.from("mock file content");
    }

    const { data, error } = await this.client!.storage.from(bucket).download(
      fileName
    );

    if (error || !data) {
      throw new Error(`Download failed: ${error?.message}`);
    }

    return Buffer.from(await data.arrayBuffer());
  }

  async deleteFile(bucket: string, fileName: string): Promise<void> {
    if (this.mockMode) {
      console.log(`[Mock] Exclusão de ${fileName} simulada.`);
      return;
    }

    const { error } = await this.client!.storage.from(bucket).remove([
      fileName,
    ]);
    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  async fileExists(bucket: string, fileName: string): Promise<boolean> {
    if (this.mockMode) {
      console.log(`[Mock] Verificação de ${fileName} simulada.`);
      return false;
    }

    const { data } = await this.client!.storage.from(bucket).list("", {
      search: fileName,
    });

    return !!data?.some((file) => file.name === fileName);
  }
}
