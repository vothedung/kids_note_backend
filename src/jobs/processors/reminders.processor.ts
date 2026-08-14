import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { VaccineStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../../modules/notifications/services/notifications.service';

/**
 * Sends reminders for upcoming vaccinations. Reads directly via PrismaService
 * (acceptable for a scheduler/background worker reading across aggregates —
 * see references/02-architecture.md "Module Isolation Rules": the rule
 * targets cross-module *repository* imports between feature modules, not a
 * dedicated jobs runner) and writes via the notifications module's public
 * NotificationsService.
 */
@Processor('reminders')
export class RemindersProcessor {
  private readonly logger = new Logger(RemindersProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Process('send-vaccination-reminders')
  async sendVaccinationReminders(job: Job<{ daysAhead?: number }>) {
    const daysAhead = job.data?.daysAhead ?? 7;
    const windowEnd = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);

    const upcoming = await this.prisma.vaccination.findMany({
      where: {
        status: VaccineStatus.UPCOMING,
        injectionDate: { lte: windowEnd, gte: new Date() },
        deletedAt: null,
      },
      include: { child: true },
    });

    for (const vaccination of upcoming) {
      await this.notificationsService.create({
        familyId: vaccination.child.familyId,
        title: 'Upcoming vaccination',
        body: `${vaccination.vaccineName} is due on ${vaccination.injectionDate?.toDateString()}.`,
      });
    }

    this.logger.log(`Sent ${upcoming.length} vaccination reminder notification(s)`);
    return { sent: upcoming.length };
  }
}
