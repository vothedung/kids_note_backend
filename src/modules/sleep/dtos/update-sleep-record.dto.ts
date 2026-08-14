import { PartialType } from '@nestjs/swagger';
import { CreateSleepRecordDto } from './create-sleep-record.dto';

export class UpdateSleepRecordDto extends PartialType(CreateSleepRecordDto) {}
