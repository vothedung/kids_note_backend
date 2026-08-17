import { Injectable } from '@nestjs/common';

/**
 * No payment provider (Stripe, etc.) is integrated yet, so there is no
 * invoice history to read. Returns an empty, correctly-shaped page so the
 * Billing screen can render its "no invoices yet" empty state. TODO: back
 * this with real invoice records once a payment provider is wired in.
 */
@Injectable()
export class GetBillingInvoicesUseCase {
  execute() {
    return { data: [], meta: { cursor: null, hasMore: false } };
  }
}
