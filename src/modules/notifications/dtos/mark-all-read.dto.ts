import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MarkAllReadDto {
  @ApiProperty()
  @IsUUID()
  familyId: string;
}
