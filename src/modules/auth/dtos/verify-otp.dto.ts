import { IsEmail, IsIn, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: '6-digit OTP code' })
  @IsString()
  @Length(6, 6)
  code: string;

  @ApiProperty({ enum: ['register', 'reset'] })
  @IsIn(['register', 'reset'])
  purpose: 'register' | 'reset';
}
