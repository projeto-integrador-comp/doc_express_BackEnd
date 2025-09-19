export class SupabaseStorageService {
  async uploadFile(bucket: string, filePath: string): Promise<string> {
    throw new Error("Not implemented yet");
  }

  async downloadFile(bucket: string, fileName: string): Promise<Buffer> {
    throw new Error("Not implemented yet");
  }

  async deleteFile(bucket: string, fileName: string): Promise<void> {
    throw new Error("Not implemented yet");
  }
}
