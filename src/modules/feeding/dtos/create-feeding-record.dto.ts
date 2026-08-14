import { IsDateString, IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FeedingType } from '@prisma/client';

export class CreateFeedingRecordDto {
  @ApiProperty({ enum: FeedingType })
  @IsEnum(FeedingType)
  category: FeedingType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  amountMl?: number;

  @ApiProperty()
  @IsDateString()
  recordedAt: string;
}
