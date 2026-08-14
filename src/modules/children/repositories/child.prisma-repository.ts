import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateChildData, IChildRepository } from './child.repository.interface';
import { ChildEntity } from '../entities/child.entity';

@Injectable()
export class ChildPrismaRepository implements IChildRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ChildEntity | null> {
    const record = await this.prisma.child.findFirst({ where: { id, deletedAt: null } });
    return record ? ChildEntity.fromPrisma(record) : null;
  }

  async findManyByFamily(familyId: string): Promise<ChildEntity[]> {
    const records = await this.prisma.child.findMany({
      where: { familyId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => ChildEntity.fromPrisma(r));
  }

  async create(data: CreateChildData): Promise<ChildEntity> {
    const record = await this.prisma.child.create({ data });
    return ChildEntity.fromPrisma(record);
  }

  async update(id: string, data: Partial<CreateChildData>): Promise<ChildEntity> {
    const record = await this.prisma.child.update({ where: { id }, data });
    return ChildEntity.fromPrisma(record);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.child.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
