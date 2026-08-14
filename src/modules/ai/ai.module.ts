import { Module } from '@nestjs/common';
import { AiController } from './controllers/ai.controller';
import { AI_CONVERSATION_REPOSITORY } from './repositories/ai-conversation.repository.interface';
import { AiConversationPrismaRepository } from './repositories/ai-conversation.prisma-repository';
import { AI_PROVIDER } from './services/ai-provider.interface';
import { StubAiProviderService } from './services/stub-ai-provider.service';
import { GenerateAiResponseUseCase } from './usecases/generate-ai-response.usecase';

@Module({
  controllers: [AiController],
  providers: [
    { provide: AI_CONVERSATION_REPOSITORY, useClass: AiConversationPrismaRepository },
    { provide: AI_PROVIDER, useClass: StubAiProviderService },
    GenerateAiResponseUseCase,
  ],
  exports: [GenerateAiResponseUseCase],
})
export class AiModule {}
