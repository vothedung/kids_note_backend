import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { decodeCursor } from '../dtos/pagination.dto';

@Injectable()
export class ParseCursorPipe implements PipeTransform {
  transform(value: string | undefined, _metadata: ArgumentMetadata) {
    if (!value) return undefined;
    try {
      return decodeCursor(value);
    } catch {
      return undefined;
    }
  }
}
