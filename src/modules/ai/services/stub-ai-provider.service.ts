import { Injectable } from '@nestjs/common';
import { AiKind } from '@prisma/client';
import { AiProviderRequest, IAiProvider } from './ai-provider.interface';

/**
 * Mocked AI provider — no real LLM key is available yet. Returns a
 * deterministic, plausible-looking response per AiKind so the endpoints are
 * fully wired end-to-end. Swap for a real provider (OpenAI/Anthropic/etc.)
 * by implementing IAiProvider and rebinding AI_PROVIDER in AiModule.
 */
@Injectable()
export class StubAiProviderService implements IAiProvider {
  async generate(request: AiProviderRequest): Promise<string> {
    const templates: Record<AiKind, (p: string) => string> = {
      [AiKind.CHAT]: (p) => `Here's a helpful answer regarding: "${p}". (stubbed response)`,
      [AiKind.JOURNAL]: (p) =>
        `Journal entry summary: ${p.slice(0, 120)}... A lovely moment worth remembering. (stubbed response)`,
      [AiKind.GROWTH_ANALYSIS]: () =>
        `Growth analysis: the recorded measurements trend within a typical range for this age. (stubbed response)`,
      [AiKind.MILESTONE]: (p) =>
        `Milestone insight: "${p}" is a great developmental step! (stubbed response)`,
    };

    return templates[request.kind](request.prompt);
  }
}
