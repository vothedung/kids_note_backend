import { AiKind } from '@prisma/client';
import { AiConversationEntity } from '../entities/ai-conversation.entity';

export const AI_CONVERSATION_REPOSITORY = Symbol('AI_CONVERSATION_REPOSITORY');

export interface CreateAiConversationData {
  userId: string;
  childId?: string | null;
  kind: AiKind;
  prompt: string;
  result: string;
}

export interface IAiConversationRepository {
  create(data: CreateAiConversationData): Promise<AiConversationEntity>;
}
