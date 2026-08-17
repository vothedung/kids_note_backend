import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMediaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  caption?: string;

  @ApiPropertyOptional({ description: 'Move to a different album, or omit/null to leave unfiled' })
  @IsOptional()
  @IsUUID()
  albumId?: string;
}
