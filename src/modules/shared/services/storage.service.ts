import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

/**
 * Supabase Storage access via the Supabase service-role client.
 * If SUPABASE_* env vars are not configured, the client is still constructed
 * but calls will fail at request time — acceptable for local dev without a
 * real project; once credentials are provided uploads/downloads work as-is.
 */
@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: SupabaseClient;
  private readonly bucket: string;
  private readonly publicUrl?: string;

  constructor(private readonly configService: ConfigService) {
    // Fallback values let the app boot without real Supabase credentials
    // configured (local dev); calls will fail at request time instead of
    // crashing startup, matching the previous R2 client's behavior.
    const supabaseUrl =
      this.configService.get<string>('storage.supabaseUrl') || 'https://placeholder.supabase.co';
    const serviceRoleKey =
      this.configService.get<string>('storage.supabaseServiceRoleKey') || 'placeholder-key';
    this.bucket = this.configService.get<string>('storage.bucketName') ?? 'kids-note-media';
    this.publicUrl = this.configService.get<string>('storage.publicUrl');

    this.client = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  buildObjectKey(childId: string, originalName: string): string {
    const ext = originalName.includes('.') ? originalName.split('.').pop() : 'bin';
    return `children/${childId}/${randomUUID()}.${ext}`;
  }

  /**
   * Returns a signed upload URL + token pair. The client uploads the binary
   * with a PUT request to `signedUrl` (token is embedded in the URL), or via
   * the Supabase client SDK's `uploadToSignedUrl(path, token, file)`.
   */
  async getUploadSignedUrl(key: string): Promise<{ signedUrl: string; token: string }> {
    const { data, error } = await this.client.storage
      .from(this.bucket)
      .createSignedUploadUrl(key);

    if (error || !data) {
      this.logger.error(`Failed to create signed upload URL for ${key}: ${error?.message}`);
      throw new InternalServerErrorException('Could not create upload URL');
    }

    return { signedUrl: data.signedUrl, token: data.token };
  }

  async getDownloadSignedUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    const { data, error } = await this.client.storage
      .from(this.bucket)
      .createSignedUrl(key, expiresInSeconds);

    if (error || !data) {
      this.logger.error(`Failed to create signed download URL for ${key}: ${error?.message}`);
      throw new InternalServerErrorException('Could not create download URL');
    }

    return data.signedUrl;
  }

  publicUrlFor(key: string): string {
    if (this.publicUrl) {
      return `${this.publicUrl}/${key}`;
    }
    return this.client.storage.from(this.bucket).getPublicUrl(key).data.publicUrl;
  }

  async deleteObject(key: string): Promise<void> {
    const { error } = await this.client.storage.from(this.bucket).remove([key]);
    if (error) {
      this.logger.warn(`Failed to delete object ${key}: ${error.message}`);
    }
  }
}
