import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class AiChatDto {
  @ApiProperty()
  @IsString()
  @MaxLength(4000)
  prompt: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  childId?: string;
}
