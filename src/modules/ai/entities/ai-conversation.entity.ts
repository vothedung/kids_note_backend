import { AiKind } from '@prisma/client';

export class AiConversationEntity {
  id: string;
  userId: string;
  childId?: string | null;
  kind: AiKind;
  prompt: string;
  result: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  static fromPrisma(record: any): AiConversationEntity {
    const entity = new AiConversationEntity();
    Object.assign(entity, record);
    return entity;
  }
}
