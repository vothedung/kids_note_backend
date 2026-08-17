import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FamilyRole } from '@prisma/client';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { FamilyAccessGuard } from '../../families/guards/family-access.guard';
import { SubscribeDto } from '../dtos/subscribe.dto';
import { GetBillingPlansUseCase } from '../usecases/get-billing-plans.usecase';
import { SubscribeUseCase } from '../usecases/subscribe.usecase';
import { GetBillingInvoicesUseCase } from '../usecases/get-billing-invoices.usecase';

@ApiTags('Billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, FamilyAccessGuard, RolesGuard)
@Controller({ path: 'families/:id/billing', version: '1' })
export class BillingController {
  constructor(
    private readonly getBillingPlans: GetBillingPlansUseCase,
    private readonly subscribeUseCase: SubscribeUseCase,
    private readonly getBillingInvoices: GetBillingInvoicesUseCase,
  ) {}

  @Get('plans')
  @ApiOperation({ summary: 'List available billing plans (any active member)' })
  plans() {
    return this.getBillingPlans.execute();
  }

  @Post('subscribe')
  @Roles(FamilyRole.OWNER)
  @ApiOperation({ summary: 'Subscribe/change plan for a family (OWNER only)' })
  async subscribe(
    @Param('id') familyId: string,
    @CurrentUser('id') actingUserId: string,
    @Body() dto: SubscribeDto,
  ) {
    return this.subscribeUseCase.execute({
      familyId,
      plan: dto.plan,
      billingCycle: dto.billingCycle,
      actingUserId,
    });
  }

  @Get('invoices')
  @Roles(FamilyRole.OWNER, FamilyRole.PARENT)
  @ApiOperation({
    summary:
      'List billing invoice history (OWNER, PARENT) — stubbed, empty until a payment provider is integrated',
  })
  async invoices() {
    return this.getBillingInvoices.execute();
  }
}
