import { Inject, Injectable } from '@nestjs/common';
import { AiKind } from '@prisma/client';
import {
  AI_CONVERSATION_REPOSITORY,
  IAiConversationRepository,
} from '../repositories/ai-conversation.repository.interface';
import { AI_PROVIDER, IAiProvider } from '../services/ai-provider.interface';

/** Generic use case shared by chat/journal/growth-analysis/milestone endpoints. */
@Injectable()
export class GenerateAiResponseUseCase {
  constructor(
    @Inject(AI_CONVERSATION_REPOSITORY) private readonly repo: IAiConversationRepository,
    @Inject(AI_PROVIDER) private readonly aiProvider: IAiProvider,
  ) {}

  async execute(input: { userId: string; childId?: string; kind: AiKind; prompt: string }) {
    const result = await this.aiProvider.generate({ kind: input.kind, prompt: input.prompt });

    return this.repo.create({
      userId: input.userId,
      childId: input.childId,
      kind: input.kind,
      prompt: input.prompt,
      result,
    });
  }
}
