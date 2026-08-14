import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PlanType } from '@prisma/client';

export class UpdateSubscriptionDto {
  @ApiProperty({ enum: PlanType })
  @IsEnum(PlanType)
  plan: PlanType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  expiredAt?: string;
}
