import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

export interface AuditLogEntry {
  userId?: string | null;
  action: string; // LOGIN, LOGOUT, CREATE, UPDATE, DELETE, PERMISSION_CHANGE, ...
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * Append-only audit trail for security-sensitive operations
 * (login, role change, billing change, ...). Never update/delete rows.
 */
@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(entry: AuditLogEntry): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        userId: entry.userId ?? null,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId ?? null,
        metadata: (entry.metadata as Prisma.InputJsonValue) ?? undefined,
      },
    });
  }
}
