import { ArrayUnique, IsArray, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NOTE_TAGS } from '../entities/note.entity';

export class CreateNoteDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(5000)
  content: string;

  @ApiPropertyOptional({ enum: NOTE_TAGS, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsIn(NOTE_TAGS, { each: true })
  tags?: string[];
}
