import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryChildrenDto {
  @ApiProperty({ description: 'Family to list children for' })
  @IsUUID()
  familyId: string;
}
