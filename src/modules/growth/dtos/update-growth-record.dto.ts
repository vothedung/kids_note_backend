import { PartialType } from '@nestjs/swagger';
import { CreateGrowthRecordDto } from './create-growth-record.dto';

export class UpdateGrowthRecordDto extends PartialType(CreateGrowthRecordDto) {}
