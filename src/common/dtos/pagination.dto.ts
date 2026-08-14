import { IsInt, IsOptional, IsString, Matches, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CursorPaginationDto {
  @ApiPropertyOptional({ description: 'Opaque cursor returned by the previous page' })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ default: 'createdAt:desc' })
  @IsOptional()
  @Matches(/^[a-zA-Z]+:(asc|desc)$/)
  sort?: string = 'createdAt:desc';
}

export function encodeCursor(record: { id: string; sortValue: string }): string {
  return Buffer.from(JSON.stringify({ id: record.id, v: record.sortValue })).toString('base64url');
}

export function decodeCursor(cursor: string): { id: string; v: string } {
  return JSON.parse(Buffer.from(cursor, 'base64url').toString());
}
