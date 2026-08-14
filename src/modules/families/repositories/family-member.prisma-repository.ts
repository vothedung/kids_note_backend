import { Injectable } from '@nestjs/common';
import { FamilyRole, MemberStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { IFamilyMemberRepository } from './family-member.repository.interface';
import { FamilyMemberEntity } from '../entities/family-member.entity';

@Injectable()
export class FamilyMemberPrismaRepository implements IFamilyMemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<FamilyMemberEntity | null> {
    const record = await this.prisma.familyMember.findFirst({ where: { id, deletedAt: null } });
    return record ? FamilyMemberEntity.fromPrisma(record) : null;
  }

  async findByFamilyAndUser(familyId: string, userId: string): Promise<FamilyMemberEntity | null> {
    const record = await this.prisma.familyMember.findFirst({
      where: { familyId, userId, deletedAt: null },
    });
    return record ? FamilyMemberEntity.fromPrisma(record) : null;
  }

  async findManyByFamily(familyId: string): Promise<FamilyMemberEntity[]> {
    const records = await this.prisma.familyMember.findMany({
      where: { familyId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });
    return records.map((r) => FamilyMemberEntity.fromPrisma(r));
  }

  async create(data: {
    familyId: string;
    userId: string;
    role: FamilyRole;
    status: MemberStatus;
    invitedEmail?: string | null;
  }): Promise<FamilyMemberEntity> {
    const record = await this.prisma.familyMember.create({ data });
    return FamilyMemberEntity.fromPrisma(record);
  }

  async updateRole(id: string, role: FamilyRole): Promise<FamilyMemberEntity> {
    const record = await this.prisma.familyMember.update({ where: { id }, data: { role } });
    return FamilyMemberEntity.fromPrisma(record);
  }

  async updateStatus(id: string, status: MemberStatus): Promise<FamilyMemberEntity> {
    const record = await this.prisma.familyMember.update({ where: { id }, data: { status } });
    return FamilyMemberEntity.fromPrisma(record);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.familyMember.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async deleteExpiredInvitations(olderThan: Date): Promise<number> {
    const result = await this.prisma.familyMember.updateMany({
      where: { status: MemberStatus.PENDING, createdAt: { lt: olderThan }, deletedAt: null },
      data: { deletedAt: new Date(), status: MemberStatus.REVOKED },
    });
    return result.count;
  }
}
