import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VaccineStatus } from '@prisma/client';

export class CreateVaccinationDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  vaccineName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  injectionDate?: string;

  @ApiPropertyOptional({ enum: VaccineStatus, default: VaccineStatus.UPCOMING })
  @IsOptional()
  @IsEnum(VaccineStatus)
  status?: VaccineStatus;
}
