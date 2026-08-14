import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateChildDto } from './create-child.dto';

export class CreateChildForFamilyDto extends CreateChildDto {
  @ApiProperty()
  @IsUUID()
  familyId: string;
}
