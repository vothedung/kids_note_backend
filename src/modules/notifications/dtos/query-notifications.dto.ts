import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CursorPaginationDto } from '../../../common/dtos/pagination.dto';

export class QueryNotificationsDto extends CursorPaginationDto {
  @ApiProperty()
  @IsUUID()
  familyId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  unreadOnly?: boolean;
}
