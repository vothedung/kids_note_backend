import { IsIn, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryMediaDto {
  @ApiPropertyOptional({ enum: ['year', 'month'] })
  @IsOptional()
  @IsIn(['year', 'month'])
  groupBy?: 'year' | 'month';
}
