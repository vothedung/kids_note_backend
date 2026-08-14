import { Module } from '@nestjs/common';
import { AuditService } from './services/audit.service';
import { StorageService } from './services/storage.service';

/**
 * Infrastructure-only concerns shared across modules (audit trail, object
 * storage). Never put business logic here — see references/02-architecture.md.
 */
@Module({
  providers: [AuditService, StorageService],
  exports: [AuditService, StorageService],
})
export class SharedModule {}
