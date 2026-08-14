import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  bucketName: process.env.SUPABASE_STORAGE_BUCKET ?? 'kids-note-media',
  publicUrl: process.env.SUPABASE_STORAGE_PUBLIC_URL,
}));
