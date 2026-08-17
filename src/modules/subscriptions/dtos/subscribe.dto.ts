import { IsEnum, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PlanType } from '@prisma/client';

export class SubscribeDto {
  @ApiProperty({ enum: PlanType })
  @IsEnum(PlanType)
  plan: PlanType;

  @ApiProperty({ enum: ['monthly', 'yearly'] })
  @IsIn(['monthly', 'yearly'])
  billingCycle: 'monthly' | 'yearly';
}
