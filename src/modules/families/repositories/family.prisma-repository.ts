import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IFamilyRepository } from './family.repository.interface';
import { FamilyEntity } from '../entities/family.entity';

@Injectable()
export class FamilyPrismaRepository implements IFamilyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<FamilyEntity | null> {
    const record = await this.prisma.family.findFirst({ where: { id, deletedAt: null } });
    return record ? FamilyEntity.fromPrisma(record) : null;
  }

  async findByIdForUser(id: string, userId: string): Promise<FamilyEntity | null> {
    const record = await this.prisma.family.findFirst({
      where: { id, deletedAt: null, members: { some: { userId, deletedAt: null } } },
    });
    return record ? FamilyEntity.fromPrisma(record) : null;
  }

  async findManyForUser(userId: string): Promise<FamilyEntity[]> {
    const records = await this.prisma.family.findMany({
      where: { deletedAt: null, members: { some: { userId, deletedAt: null } } },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => FamilyEntity.fromPrisma(r));
  }

  async create(data: { name: string; ownerId: string }): Promise<FamilyEntity> {
    const record = await this.prisma.family.create({ data });
    return FamilyEntity.fromPrisma(record);
  }

  async update(id: string, data: Partial<{ name: string }>): Promise<FamilyEntity> {
    const record = await this.prisma.family.update({ where: { id }, data });
    return FamilyEntity.fromPrisma(record);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.family.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
