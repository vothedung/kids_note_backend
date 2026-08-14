import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { AiKind } from '@prisma/client';
import { GenerateAiResponseUseCase } from '../../modules/ai/usecases/generate-ai-response.usecase';

interface GenerateSummaryJobData {
  userId: string;
  childId?: string;
  prompt: string;
}

/** Generates an async AI summary (stubbed provider) and persists it as an AiConversation. */
@Processor('ai-summaries')
export class AiSummaryProcessor {
  private readonly logger = new Logger(AiSummaryProcessor.name);

  constructor(private readonly generateAiResponse: GenerateAiResponseUseCase) {}

  @Process('generate-summary')
  async generateSummary(job: Job<GenerateSummaryJobData>) {
    const { userId, childId, prompt } = job.data;
    const conversation = await this.generateAiResponse.execute({
      userId,
      childId,
      kind: AiKind.GROWTH_ANALYSIS,
      prompt,
    });
    this.logger.log(`Generated AI summary ${conversation.id} for user ${userId}`);
    return { conversationId: conversation.id };
  }
}
