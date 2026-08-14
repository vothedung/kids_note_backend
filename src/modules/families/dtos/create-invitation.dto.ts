import { IsEmail, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FamilyRole } from '@prisma/client';

export class CreateInvitationDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ enum: FamilyRole })
  @IsEnum(FamilyRole)
  role: FamilyRole;
}
