import { IsDateString, IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MediaType } from '@prisma/client';

/**
 * Request a signed upload URL for a media asset. The client uploads the
 * binary directly to Supabase Storage via the returned `uploadUrl`/`uploadToken`,
 * then confirms with the returned `key`/`url` when creating the Media record
 * (same payload, plus the object key echoed back from step 1).
 */
export class CreateMediaDto {
  @ApiProperty({ enum: MediaType })
  @IsEnum(MediaType)
  type: MediaType;

  @ApiProperty({ description: 'Original filename, used to derive the object key/extension' })
  @IsString()
  @MaxLength(255)
  fileName: string;

  @ApiProperty({ description: 'MIME type of the file being uploaded' })
  @IsString()
  @MaxLength(255)
  contentType: string;

  @ApiProperty()
  @IsDateString()
  takenAt: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  noteId?: string;
}
