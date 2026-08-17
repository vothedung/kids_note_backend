import { PlanType } from '@prisma/client';

/**
 * Static plan catalog per the product PRD's business model. Prices are
 * placeholders (USD) — wire to a real billing/payment provider (Stripe,
 * etc.) before going live; yearly price reflects a 20% discount.
 */
export const PLAN_CATALOG = [
  {
    plan: PlanType.FREE,
    name: 'Free',
    priceMonthly: 0,
    priceYearly: 0,
    features: ['1 child', '1 GB storage', 'Basic notes'],
  },
  {
    plan: PlanType.PREMIUM,
    name: 'Premium',
    priceMonthly: 4.99,
    priceYearly: 47.9,
    features: ['Up to 5 children', '50 GB storage', 'Growth analytics', 'Vaccination reminders'],
  },
  {
    plan: PlanType.FAMILY,
    name: 'Family',
    priceMonthly: 9.99,
    priceYearly: 95.9,
    features: ['Up to 10 members', 'Shared access', 'Role-based permissions'],
  },
  {
    plan: PlanType.AI_ADDON,
    name: 'AI',
    priceMonthly: 2.99,
    priceYearly: 28.7,
    features: ['AI journal', 'AI growth analysis', 'AI-powered summaries'],
  },
] as const;
