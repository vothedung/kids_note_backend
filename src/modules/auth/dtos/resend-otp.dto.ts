import { IsEmail, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendOtpDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ enum: ['register', 'reset'] })
  @IsIn(['register', 'reset'])
  purpose: 'register' | 'reset';
}
