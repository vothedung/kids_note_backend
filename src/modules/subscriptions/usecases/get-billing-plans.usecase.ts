import { Injectable } from '@nestjs/common';
import { PLAN_CATALOG } from '../config/plan-catalog';

@Injectable()
export class GetBillingPlansUseCase {
  execute() {
    return { plans: PLAN_CATALOG };
  }
}
