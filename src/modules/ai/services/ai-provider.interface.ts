import { AiKind } from '@prisma/client';

export const AI_PROVIDER = Symbol('AI_PROVIDER');

export interface AiProviderRequest {
  kind: AiKind;
  prompt: string;
  context?: Record<string, unknown>;
}

/** Swappable AI provider port — implement against a real LLM later. */
export interface IAiProvider {
  generate(request: AiProviderRequest): Promise<string>;
}
