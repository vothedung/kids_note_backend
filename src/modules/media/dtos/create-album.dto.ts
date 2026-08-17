import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlbumDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  name: string;
}
