# API Capability Registry

This is the **single source of truth** for all business capabilities exposed as API endpoints.

Before proposing a new endpoint, check this registry:
1. Does an existing capability already serve the need?
2. If yes → add the new screen as a consumer, possibly extend filters/fields.
3. If no → add a new row. State why no existing capability covers it.

**Screens are consumers, never sources, of API design.**

## How to Read This Table

| Column | Meaning |
|--------|---------|
| ID | Stable identifier for the capability (CAP-NNN) |
| Capability | What the system can do (business language) |
| Domain | Which bounded context owns this |
| Endpoint | HTTP method + path |
| Consumers | Which screens/features use this endpoint |
| Auth | Required role(s) |
| Notes | Pagination, caching, special behavior |

## Registry

| ID | Capability | Domain | Endpoint | Consumers | Auth | Notes |
|----|-----------|--------|----------|-----------|------|-------|
| CAP-001 | Query Products | Catalog | `GET /api/v1/products` | Product List, Search Results, Admin Products, Recommendations | ANY | Cursor pagination, filterable by category/status/price |
| CAP-002 | Get Product Detail | Catalog | `GET /api/v1/products/:id` | Product Detail Page, Quick View Modal, Cart Item Display | ANY | Includes variants, images; cached 5min |
| CAP-003 | Create Product | Catalog | `POST /api/v1/products` | Admin Product Form | ADMIN | Validates unique SKU |
| CAP-004 | Place Order | Orders | `POST /api/v1/orders` | Checkout Page | CUSTOMER | Validates stock, calculates total, reserves stock |
| CAP-005 | Query Orders | Orders | `GET /api/v1/orders` | Order History, Admin Orders | CUSTOMER (own), ADMIN (all) | Cursor pagination, filterable by status/date |
| CAP-006 | Get Order Detail | Orders | `GET /api/v1/orders/:id` | Order Detail, Order Confirmation, Admin Order View | CUSTOMER (own), ADMIN | Includes items, status history |
| CAP-007 | Cancel Order | Orders | `POST /api/v1/orders/:id/cancel` | Order Detail (cancel button) | CUSTOMER (own, if PENDING/CONFIRMED), ADMIN | Releases stock, triggers refund if paid |
| | | | | | | |
| CAP-100 | Register (local) | Auth | `POST /api/v1/auth/register` | Sign Up screen | Public | bcrypt-hashes password, issues token pair; also fires a register-purpose OTP (CAP-130) for email verification, best-effort (failure doesn't fail registration) |
| CAP-101 | Login (local) | Auth | `POST /api/v1/auth/login` | Login screen | Public | Throttled 5/min/IP |
| CAP-102 | Refresh tokens | Auth | `POST /api/v1/auth/refresh` | Silent token refresh | Public (valid refresh token) | Rotation + reuse detection, revokes all on reuse |
| CAP-103 | Logout | Auth | `POST /api/v1/auth/logout` | Logout action | Authenticated | Revokes all refresh tokens for user |
| CAP-104 | Social login (Google/Facebook/Apple) | Auth | `GET /api/v1/auth/social/google/start`, `GET /api/v1/auth/social/facebook/start`, `POST /api/v1/auth/social/apple` | Social sign-in buttons | Public | Google/Facebook via Passport redirect; Apple via id_token POST (stubbed verifier — TODO real ES256 verification) |
| CAP-105 | Get/update own profile | Users | `GET /api/v1/users/me`, `PATCH /api/v1/users/me` | Profile screen | Authenticated | |
| CAP-106 | Create family | Families | `POST /api/v1/families` | Family onboarding | Authenticated | Caller becomes OWNER |
| CAP-107 | List my families | Families | `GET /api/v1/families` | Family switcher | Authenticated | |
| CAP-108 | Update family | Families | `PATCH /api/v1/families/:id` | Family settings | OWNER | |
| CAP-109 | Invite family member | Families | `POST /api/v1/families/:id/invitations` | Invite screen | OWNER, PARENT | Creates PENDING FamilyMember by email |
| CAP-110 | List family members | Families | `GET /api/v1/families/:id/members` | Members list | Any active member | |
| CAP-111 | Change member role | Families | `PATCH /api/v1/families/:id/members/:memberId` | Member management | OWNER | Writes AuditLog (PERMISSION_CHANGE) |
| CAP-112 | Get/update subscription | Subscriptions | `GET /api/v1/families/:id/subscription`, `PATCH .../subscription` | Billing screen | GET: OWNER, PARENT; PATCH: OWNER | Writes AuditLog (BILLING_CHANGE) |
| CAP-113 | Child CRUD | Children | `POST/GET/PATCH/DELETE /api/v1/children[/:id]` | Child profile screens | Create/Delete: OWNER, PARENT; Update: +CAREGIVER; Read: any active member | |
| CAP-114 | Child timeline | Notes | `GET /api/v1/children/:id/timeline` | Home/timeline feed | Any active member | Merge-sorted Notes + Milestones, cursor-paginated |
| CAP-115 | Notes CRUD | Notes | `POST/GET/PATCH/DELETE /api/v1/children/:childId/notes[/:noteId]` | Notes feed | Write: OWNER, PARENT, CAREGIVER; Read: any | |
| CAP-116 | Milestones CRUD | Notes | `POST/GET/PATCH/DELETE /api/v1/children/:childId/milestones[/:milestoneId]` | Milestones screen | Write: OWNER, PARENT, CAREGIVER; Read: any | |
| CAP-117 | Media upload + list | Media | `POST /api/v1/children/:id/media`, `GET .../media?groupBy=year\|month` | Album screen | Create: OWNER, PARENT, CAREGIVER; Delete: OWNER, PARENT; Read: any | Returns Supabase Storage signed upload URL + token via @supabase/supabase-js |
| CAP-118 | Growth records CRUD + trend | Growth | `.../growth-records[/:id]`, `GET .../growth-records/trend` | Growth chart screen | Write: OWNER, PARENT; Update: +CAREGIVER; Read: any | Trend includes deltas per metric |
| CAP-119 | Sleep records CRUD + analytics | Sleep | `.../sleep-records[/:id]`, `GET .../sleep-records/analytics` | Sleep tracker screen | Write: OWNER, PARENT; Update: +CAREGIVER; Read: any | Analytics: avg duration + per-day totals |
| CAP-120 | Feeding records CRUD + analytics | Feeding | `.../feeding-records[/:id]`, `GET .../feeding-records/analytics` | Feeding tracker screen | Write: OWNER, PARENT; Update: +CAREGIVER; Read: any | Analytics: by category + by day |
| CAP-121 | Vaccinations CRUD + reminder settings | Vaccinations | `.../vaccinations[/:id]`, `PATCH .../vaccinations/reminder-settings` | Vaccination schedule screen | Write: OWNER, PARENT; Update: +CAREGIVER; Read: any | reminder-settings not yet persisted (TODO: dedicated table) |
| CAP-122 | Notifications list/read | Notifications | `GET/PATCH /api/v1/notifications`, `PATCH /api/v1/notifications/:id/read` | Notifications inbox | Any active member (scoped by familyId) | |
| CAP-123 | AI chat/journal/growth-analysis/milestone | AI | `POST /api/v1/ai/chat`, `/journal`, `/growth-analysis`, `/milestone` | AI assistant screens | Authenticated | Stubbed provider (StubAiProviderService); swap AI_PROVIDER binding for a real LLM later |
| CAP-124 | Forgot/reset password | Auth | `POST /api/v1/auth/forgot-password`, `POST /api/v1/auth/reset-password` | Forgot Password, Reset Password screens | Public | forgot-password sends an OTP (see CAP-130); reset-password consumes the resetToken CAP-130 returns. Reset token hashed (SHA-256), 30min TTL, single-use; reset revokes all refresh tokens. Email via Resend, falls back to StubEmailProviderService without RESEND_API_KEY |
| CAP-125 | Dashboard child summary | Dashboard | `GET /api/v1/children/:id/summary` | Home/Dashboard screen | Any active member | Composes Children/Growth/Vaccinations/Notifications usecases, no new repository |
| CAP-126 | Today's activities | Dashboard | `GET /api/v1/children/:id/activities/today` | Home/Dashboard screen | Any active member | Merges Notes/Sleep/Feeding from existing list usecases, filtered client-side to today |
| CAP-127 | Notification preferences get/update | Users | `GET/PATCH /api/v1/users/me/notification-settings` | Settings > Notifications screen | Any authenticated (own settings only) | Stored as JSON column on User; defaults applied for unset keys |
| CAP-128 | Billing plans/subscribe/invoices | Subscriptions | `GET /api/v1/families/:id/billing/plans`, `POST .../billing/subscribe`, `GET .../billing/invoices` | Subscription, Billing screens | plans: any active member; subscribe: OWNER; invoices: OWNER, PARENT | subscribe wraps CAP-112's update-subscription usecase; invoices stubbed empty (no payment provider) |
| CAP-129 | Family storage usage | Storage | `GET /api/v1/families/:id/storage` | Settings > Storage screen | Any active member | Sums Media.sizeBytes by type via Prisma aggregate; quota derived from Subscription plan (FREE=1GiB, others=50GiB) |
| CAP-130 | OTP verify (email verification / password reset) | Auth | `POST /api/v1/auth/verify-otp` | OTP Verify screen | Public | Redis-backed 6-digit code (10min TTL, single-use, 5-attempt cap); purpose=register marks emailVerifiedAt; purpose=reset issues a PasswordResetToken consumed by CAP for reset-password. Supersedes the original email-link-only forgot-password design |
| CAP-131 | OTP resend | Auth | `POST /api/v1/auth/resend-otp` | OTP Verify screen ("Resend" link) | Public | 60s cooldown per email+purpose via Redis key; generic response regardless of account existence |
| CAP-132 | Album create/list | Media | `POST/GET /api/v1/children/:id/albums` | Album screen ("+ New Album"), Edit Photo ("move to album") | Create: OWNER, PARENT, CAREGIVER; Read: any active member | Named collections, distinct from the year/month auto-grouping in CAP-117 |
| CAP-133 | Media update (caption/album) | Media | `PATCH /api/v1/children/:id/media/:mediaId` | Edit Photo screen | OWNER, PARENT, CAREGIVER | Validates albumId belongs to the same child; no support yet for clearing albumId back to null |
| _CAP-NNN_ | _[Describe capability]_ | _[Domain]_ | _[Method /path]_ | _[List consumers]_ | _[Roles]_ | _[Notes]_ |

## Adding a New Capability

1. Pick the next CAP-NNN number
2. Fill in all columns
3. Under "Consumers", list every screen/feature that will call this endpoint
4. If the capability is similar to an existing one, explain in Notes why it can't be merged
5. Get architecture review before implementation

## Deprecating a Capability

1. Add `[DEPRECATED]` prefix to the capability name
2. Set a sunset date in Notes
3. Add `Sunset` header to the endpoint response
4. Ensure all consumers have migrated before removal
