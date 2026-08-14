import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FamilyRole } from '@prisma/client';

export class UpdateMemberRoleDto {
  @ApiProperty({ enum: FamilyRole })
  @IsEnum(FamilyRole)
  role: FamilyRole;
}
