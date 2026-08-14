import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiKind } from '@prisma/client';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { AiChatDto } from '../dtos/ai-chat.dto';
import { GenerateAiResponseUseCase } from '../usecases/generate-ai-response.usecase';

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'ai', version: '1' })
export class AiController {
  constructor(private readonly generateAiResponse: GenerateAiResponseUseCase) {}

  @Post('chat')
  @ApiOperation({ summary: 'Freeform chat with the (stubbed) parenting assistant' })
  async chat(@CurrentUser('id') userId: string, @Body() dto: AiChatDto) {
    return this.generateAiResponse.execute({
      userId,
      childId: dto.childId,
      kind: AiKind.CHAT,
      prompt: dto.prompt,
    });
  }

  @Post('journal')
  @ApiOperation({ summary: 'Turn a raw note into a polished journal entry (stubbed)' })
  async journal(@CurrentUser('id') userId: string, @Body() dto: AiChatDto) {
    return this.generateAiResponse.execute({
      userId,
      childId: dto.childId,
      kind: AiKind.JOURNAL,
      prompt: dto.prompt,
    });
  }

  @Post('growth-analysis')
  @ApiOperation({ summary: 'Summarize growth trend in plain language (stubbed)' })
  async growthAnalysis(@CurrentUser('id') userId: string, @Body() dto: AiChatDto) {
    return this.generateAiResponse.execute({
      userId,
      childId: dto.childId,
      kind: AiKind.GROWTH_ANALYSIS,
      prompt: dto.prompt,
    });
  }

  @Post('milestone')
  @ApiOperation({ summary: 'Generate an encouraging note about a milestone (stubbed)' })
  async milestone(@CurrentUser('id') userId: string, @Body() dto: AiChatDto) {
    return this.generateAiResponse.execute({
      userId,
      childId: dto.childId,
      kind: AiKind.MILESTONE,
      prompt: dto.prompt,
    });
  }
}
