import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  CreateAiConversationData,
  IAiConversationRepository,
} from './ai-conversation.repository.interface';
import { AiConversationEntity } from '../entities/ai-conversation.entity';

@Injectable()
export class AiConversationPrismaRepository implements IAiConversationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAiConversationData): Promise<AiConversationEntity> {
    const record = await this.prisma.aiConversation.create({ data });
    return AiConversationEntity.fromPrisma(record);
  }
}
