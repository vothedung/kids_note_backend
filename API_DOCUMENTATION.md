# Kids Note API Documentation

For the mobile/web app team. Base URL, auth, response format, and every endpoint
with request/response shapes and required roles.

## Base URL & Versioning

```
http://<host>:3000/api/v1
```

- All routes are prefixed with `/api` and versioned with `/v1` (URI versioning).
- Interactive Swagger UI: `http://<host>:3000/docs`
- Health check (no auth): `GET /api/v1/health`, `GET /api/v1/health/live`

## Authentication

Send the access token on every authenticated request:

```
Authorization: Bearer <accessToken>
```

- Access token expiry: 15 minutes (`JWT_ACCESS_EXPIRY`)
- Refresh token expiry: 7 days (`JWT_REFRESH_EXPIRY`), rotated on every `/auth/refresh` call (reuse of an old refresh token revokes the whole chain)
- Routes marked **Public** below need no token.

## Response Envelope

**Success**
```json
{ "success": true, "data": { }, "meta": { } }
```
`meta` only appears on paginated/list endpoints.

**Error**
```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Validation failed", "details": ["field must be ..."] } }
```

Common `error.code` values: `VALIDATION_ERROR` (400), `UNAUTHORIZED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `CONFLICT` (409), `INTERNAL_ERROR` (500).

## Cursor Pagination

List endpoints accept:

| Query param | Default | Notes |
|---|---|---|
| `cursor` | — | opaque string returned as `meta.cursor` from the previous page |
| `limit` | 20 | 1–100 |
| `sort` | `createdAt:desc` | format `field:asc\|desc` |

Response: `{ success, data: [...], meta: { cursor, hasMore } }`

## JSON → Dart Type Mapping

| JSON wire type | Dart type | Notes |
|---|---|---|
| UUID string | `String` | e.g. `id`, `familyId`, `childId` |
| ISO 8601 date/datetime string | `DateTime` | parse with `DateTime.parse(...)`; `birthday`/`milestoneDate`/`recordedAt`/etc. are date-only but still ISO strings — send `"YYYY-MM-DD"` or full datetime, both parse fine |
| number (decimal fields) | `double` | `weightKg`, `heightCm`, `headCircumCm` — serialized as JSON numbers (not strings) |
| number (integer fields) | `int` | `amountMl`, pagination `limit` |
| string enum | `String` (or a Dart `enum` you define client-side) | see [Enums](#enums) table for exact values — match case exactly, e.g. `"OWNER"` not `"Owner"` |
| `string[]` | `List<String>` | `Note.tags` |
| nullable field | `Type?` | any field marked optional/`?` below can be `null` in the JSON |

## Enums

| Enum | Values |
|---|---|
| `FamilyRole` | `OWNER`, `PARENT`, `GRANDPARENT`, `CAREGIVER` |
| `MemberStatus` | `PENDING`, `ACTIVE`, `REVOKED` |
| `AuthProvider` | `LOCAL`, `GOOGLE`, `FACEBOOK`, `APPLE` |
| `PlanType` | `FREE`, `PREMIUM`, `FAMILY`, `AI_ADDON` |
| `Gender` | `MALE`, `FEMALE`, `OTHER` |
| `MediaType` | `IMAGE`, `VIDEO` |
| `FeedingType` | `BREAST_MILK`, `FORMULA`, `SOLID`, `WATER` |
| `VaccineStatus` | `UPCOMING`, `DONE`, `MISSED` |
| `AiKind` | `CHAT`, `JOURNAL`, `GROWTH_ANALYSIS`, `MILESTONE` |
| Note `tags` | `Feeding`, `Sleep`, `Milestone`, `Health`, `Fun` |

## RBAC Summary

| Capability | OWNER | PARENT | GRANDPARENT | CAREGIVER |
|---|---|---|---|---|
| Family update / role change | ✅ | ❌ | ❌ | ❌ |
| Invite member | ✅ | ✅ | ❌ | ❌ |
| Child create/delete | ✅ | ✅ | ❌ | ❌ |
| Child update | ✅ | ✅ | ❌ | ✅ |
| Notes/Milestones CRUD | ✅ | ✅ | read-only | ✅ |
| Growth/Sleep/Feeding/Vaccination create/delete | ✅ | ✅ | read-only | ❌ |
| Growth/Sleep/Feeding/Vaccination update | ✅ | ✅ | read-only | ✅ |
| Media create | ✅ | ✅ | read-only | ✅ |
| Media delete | ✅ | ✅ | ❌ | ❌ |
| Billing/Subscription read | ✅ | ✅ | ❌ | ❌ |
| Billing/Subscription update | ✅ | ❌ | ❌ | ❌ |

A 403 is returned when the caller's role isn't in the list for that action; a 404/`FORBIDDEN` is returned if the caller isn't a member of the family/child at all.

---

## Response Data Models

Every model below is what a `GET`/list/create response's `data` field actually contains, with Dart-ready types. All models include `createdAt: DateTime`, `updatedAt: DateTime`, `deletedAt: DateTime?` unless noted otherwise (soft-deleted rows are excluded from normal queries, so `deletedAt` is effectively always `null` in responses you'll see).

### User
| Field | Type |
|---|---|
| `id` | `String` (UUID) |
| `email` | `String` |
| `fullName` | `String` |
| `avatarUrl` | `String?` |
| `provider` | `String` — `AuthProvider` |
| `emailVerifiedAt` | `DateTime?` — `null` until `verify-otp` (purpose `register`) succeeds |
| `createdAt` | `DateTime` |

`passwordHash` / `providerId` are never returned in API responses.

### Auth response (`register` / `login` / `refresh` / social callbacks)
| Field | Type |
|---|---|
| `user` | `User` |
| `accessToken` | `String` (JWT) |
| `refreshToken` | `String` |

### Family
| Field | Type |
|---|---|
| `id` | `String` (UUID) |
| `name` | `String` |
| `ownerId` | `String` (UUID) |
| `createdAt` / `updatedAt` / `deletedAt` | `DateTime` / `DateTime` / `DateTime?` |

### FamilyMember
| Field | Type |
|---|---|
| `id` | `String` (UUID) |
| `familyId` | `String` (UUID) |
| `userId` | `String` (UUID) |
| `role` | `String` — `FamilyRole` |
| `status` | `String` — `MemberStatus` |
| `invitedEmail` | `String?` |
| `createdAt` / `updatedAt` / `deletedAt` | `DateTime` / `DateTime` / `DateTime?` |

### Subscription
| Field | Type |
|---|---|
| `id` | `String` (UUID) |
| `familyId` | `String` (UUID) |
| `plan` | `String` — `PlanType` |
| `startedAt` | `DateTime` |
| `expiredAt` | `DateTime?` |
| `createdAt` / `updatedAt` / `deletedAt` | `DateTime` / `DateTime` / `DateTime?` |

### Child
| Field | Type |
|---|---|
| `id` | `String` (UUID) |
| `familyId` | `String` (UUID) |
| `name` | `String` |
| `birthday` | `DateTime` |
| `gender` | `String` — `Gender` |
| `avatarUrl` | `String?` |
| `createdAt` / `updatedAt` / `deletedAt` | `DateTime` / `DateTime` / `DateTime?` |

### Note
| Field | Type |
|---|---|
| `id` | `String` (UUID) |
| `childId` | `String` (UUID) |
| `authorId` | `String` (UUID) |
| `title` | `String?` |
| `content` | `String` |
| `tags` | `List<String>` — subset of `Feeding`/`Sleep`/`Milestone`/`Health`/`Fun` |
| `createdAt` / `updatedAt` / `deletedAt` | `DateTime` / `DateTime` / `DateTime?` |

### Milestone
| Field | Type |
|---|---|
| `id` | `String` (UUID) |
| `childId` | `String` (UUID) |
| `title` | `String` |
| `description` | `String?` |
| `milestoneDate` | `DateTime` |
| `createdAt` / `updatedAt` / `deletedAt` | `DateTime` / `DateTime` / `DateTime?` |

### Timeline item
Timeline entries are a tagged union of `Note` and `Milestone`, each with a `kind` discriminator and a common `timestamp` for sorting:
| Field | Type |
|---|---|
| `kind` | `String` — `"note"` or `"milestone"` |
| `timestamp` | `DateTime` |
| ...remaining fields | same as `Note` or `Milestone` above, matching `kind` |

### Media
| Field | Type |
|---|---|
| `id` | `String` (UUID) |
| `childId` | `String` (UUID) |
| `noteId` | `String?` (UUID) |
| `albumId` | `String?` (UUID) — set via `PATCH .../media/:mediaId` |
| `url` | `String` — public URL (usable directly as an image/video source once uploaded) |
| `type` | `String` — `MediaType` |
| `caption` | `String?` — set via `PATCH .../media/:mediaId` |
| `takenAt` | `DateTime` |
| `createdAt` / `updatedAt` / `deletedAt` | `DateTime` / `DateTime` / `DateTime?` |

### Album
| Field | Type |
|---|---|
| `id` | `String` (UUID) |
| `childId` | `String` (UUID) |
| `name` | `String` |
| `createdAt` / `updatedAt` / `deletedAt` | `DateTime` / `DateTime` / `DateTime?` |

### Media upload response (`POST /children/:id/media`)
| Field | Type |
|---|---|
| `media` | `Media` (see above; `url` is valid only after the upload step completes) |
| `uploadUrl` | `String` — signed URL, `PUT` the binary here |
| `uploadToken` | `String` — same token embedded in `uploadUrl`; needed only if using the Supabase client SDK's `uploadToSignedUrl` |
| `key` | `String` — storage object path |

`Media.sizeBytes: int?` — pass the file's byte length as `sizeBytes` in the `POST` request body (optional) so it counts toward the family's [storage usage](#familystorageusage-get-familiesidstorage). Omit it and it's simply not counted.

### NotificationSettings (`GET`/`PATCH /users/me/notification-settings`)
| Field | Type | Default |
|---|---|---|
| `milestones` | `bool` | `true` |
| `reminders` | `bool` | `true` |
| `tips` | `bool` | `true` |
| `familyComments` | `bool` | `true` |
| `weeklyDigest` | `bool` | `true` |

### ChildSummary (`GET /children/:id/summary`)
| Field | Type |
|---|---|
| `child` | `Child` |
| `latestGrowth` | `GrowthTrendPoint?` — `null` if no growth records exist yet |
| `upcomingVaccinationsCount` | `int` |
| `unreadNotificationsCount` | `int` |

### TodayActivityItem (`GET /children/:id/activities/today`)
Response `data` shape: `List<TodayActivityItem>`, a tagged union:
| Field | Type |
|---|---|
| `kind` | `String` — `"note"`, `"sleep"`, or `"feeding"` |
| `timestamp` | `DateTime` |
| ...remaining fields | same as `Note` / `SleepRecord` / `FeedingRecord` above, matching `kind` |

### BillingPlan (`GET /families/:id/billing/plans`)
| Field | Type |
|---|---|
| `plan` | `String` — `PlanType` |
| `name` | `String` |
| `priceMonthly` | `double` (USD) |
| `priceYearly` | `double` (USD, ~20% off monthly×12) |
| `features` | `List<String>` |

### FamilyStorageUsage (`GET /families/:id/storage`)
| Field | Type |
|---|---|
| `plan` | `String` — `PlanType` (defaults to `FREE` if the family has no subscription row yet) |
| `usedBytes` | `int` |
| `limitBytes` | `int` — `1 GiB` for `FREE`, `50 GiB` for all other plans |
| `usedPercent` | `double` — `usedBytes / limitBytes * 100`, rounded to 1 decimal |
| `breakdown` | `{ photosBytes: int, videosBytes: int }` — text/notes are not counted toward the quota |

### GrowthRecord
| Field | Type |
|---|---|
| `id` | `String` (UUID) |
| `childId` | `String` (UUID) |
| `weightKg` | `double?` |
| `heightCm` | `double?` |
| `headCircumCm` | `double?` |
| `recordedAt` | `DateTime` |
| `createdAt` / `updatedAt` / `deletedAt` | `DateTime` / `DateTime` / `DateTime?` |

### Growth trend response (`GET .../growth-records/trend`)
Response `data` shape: `{ points: List<GrowthTrendPoint> }`.

**GrowthTrendPoint**
| Field | Type |
|---|---|
| `recordedAt` | `DateTime` |
| `weightKg` | `double?` |
| `heightCm` | `double?` |
| `headCircumCm` | `double?` |
| `deltaWeightKg` | `double?` — change vs. previous record; `null` on the first point |
| `deltaHeightCm` | `double?` — change vs. previous record; `null` on the first point |

(head circumference has no delta computed yet)

### SleepRecord
| Field | Type |
|---|---|
| `id` | `String` (UUID) |
| `childId` | `String` (UUID) |
| `startedAt` | `DateTime` |
| `endedAt` | `DateTime?` |
| `createdAt` / `updatedAt` / `deletedAt` | `DateTime` / `DateTime` / `DateTime?` |

### Sleep analytics response (`GET .../sleep-records/analytics`)
| Field | Type |
|---|---|
| `averageDurationMinutes` | `int` |
| `totalRecords` | `int` |
| `byDay` | `List<{ day: String (YYYY-MM-DD), totalMinutes: int }>` |

### FeedingRecord
| Field | Type |
|---|---|
| `id` | `String` (UUID) |
| `childId` | `String` (UUID) |
| `category` | `String` — `FeedingType` |
| `amountMl` | `int?` |
| `recordedAt` | `DateTime` |
| `createdAt` / `updatedAt` / `deletedAt` | `DateTime` / `DateTime` / `DateTime?` |

### Feeding analytics response (`GET .../feeding-records/analytics`)
| Field | Type |
|---|---|
| `totalRecords` | `int` |
| `byCategory` | `List<{ category: String (FeedingType), count: int, totalMl: int }>` |
| `byDay` | `List<{ day: String (YYYY-MM-DD), count: int }>` |

### Vaccination
| Field | Type |
|---|---|
| `id` | `String` (UUID) |
| `childId` | `String` (UUID) |
| `vaccineName` | `String` |
| `injectionDate` | `DateTime?` |
| `status` | `String` — `VaccineStatus` |
| `createdAt` / `updatedAt` / `deletedAt` | `DateTime` / `DateTime` / `DateTime?` |

### Reminder settings (`PATCH .../vaccinations/reminder-settings`)
| Field | Type |
|---|---|
| `enabled` | `bool` (default `true`) |
| `daysBefore` | `int` (1–60, default `7`) |

### Notification
| Field | Type |
|---|---|
| `id` | `String` (UUID) |
| `familyId` | `String` (UUID) |
| `title` | `String` |
| `body` | `String` |
| `isRead` | `bool` |
| `createdAt` / `updatedAt` / `deletedAt` | `DateTime` / `DateTime` / `DateTime?` |

### AiConversation (`POST /ai/*` response)
| Field | Type |
|---|---|
| `id` | `String` (UUID) |
| `userId` | `String` (UUID) |
| `childId` | `String?` (UUID) |
| `kind` | `String` — `AiKind` |
| `prompt` | `String` |
| `result` | `String` — the (stubbed) AI response text |
| `createdAt` / `updatedAt` / `deletedAt` | `DateTime` / `DateTime` / `DateTime?` |

---

## Auth (`/auth`)

| Method | Path | Auth | Body | Notes |
|---|---|---|---|---|
| POST | `/auth/register` | Public | `{ email, password (8-72 chars), fullName }` | Returns `{ user, accessToken, refreshToken }` |
| POST | `/auth/login` | Public (rate-limited: 5/min) | `{ email, password }` | Returns `{ user, accessToken, refreshToken }` |
| POST | `/auth/refresh` | Public | `{ refreshToken }` | Rotates tokens; reusing a revoked token invalidates the whole session chain |
| POST | `/auth/logout` | Bearer | — | Revokes all refresh tokens for the user |
| GET | `/auth/social/google/start` | Public | — | Redirects to Google consent screen |
| GET | `/auth/social/google/callback` | Public | — | Google OAuth callback, returns `{ user, accessToken, refreshToken }` |
| GET | `/auth/social/facebook/start` | Public | — | Redirects to Facebook consent screen |
| GET | `/auth/social/facebook/callback` | Public | — | Facebook OAuth callback |
| POST | `/auth/social/apple` | Public | `{ idToken }` | Exchanges an Apple identity token for a session |
| POST | `/auth/forgot-password` | Public (rate-limited: 5/min) | `{ email }` | Always returns `{ message }` regardless of whether the email exists (no account enumeration) or whether the email send itself succeeds. Local accounts only. Sends a 6-digit OTP via email — follow with `verify-otp` (purpose `reset`) then `reset-password` |
| POST | `/auth/verify-otp` | Public | `{ email, code, purpose: "register" \| "reset" }` | `purpose=register`: marks the account's email verified, returns `{ verified: true }`. `purpose=reset`: returns `{ verified: true, resetToken }` — pass `resetToken` to `reset-password`. Code is 6 digits, 10-minute TTL, single-use, max 5 attempts |
| POST | `/auth/resend-otp` | Public (rate-limited: 5/min, plus a 60s per-email/purpose cooldown → `429`) | `{ email, purpose: "register" \| "reset" }` | Always returns `{ message }` regardless of whether the email exists |
| POST | `/auth/reset-password` | Public | `{ token, newPassword }` | `token` is the `resetToken` returned by `verify-otp` (purpose `reset`). Expires after 30 minutes and is single-use; on success, all of the user's refresh tokens are revoked (forces re-login everywhere) |

## Users (`/users`)

| Method | Path | Roles | Body |
|---|---|---|---|
| GET | `/users/me` | any authenticated | — |
| PATCH | `/users/me` | any authenticated | `{ fullName?, avatarUrl? }` |
| GET | `/users/me/notification-settings` | any authenticated | returns `NotificationSettings` (see below), defaults applied for any never-set keys |
| PATCH | `/users/me/notification-settings` | any authenticated | `{ milestones?, reminders?, tips?, familyComments?, weeklyDigest? }` (all `bool`, partial update — merges with existing) |

## Families (`/families`)

| Method | Path | Roles | Body |
|---|---|---|---|
| POST | `/families` | any authenticated (becomes OWNER) | `{ name }` |
| GET | `/families` | any authenticated | — (lists families the caller belongs to) |
| PATCH | `/families/:id` | OWNER | `{ name? }` |
| POST | `/families/:id/invitations` | OWNER, PARENT | `{ email, role: FamilyRole }` |
| GET | `/families/:id/members` | any active member | — |
| PATCH | `/families/:id/members/:memberId` | OWNER | `{ role: FamilyRole }` |

## Subscription (`/families/:id/subscription`)

| Method | Path | Roles | Body |
|---|---|---|---|
| GET | `/families/:id/subscription` | OWNER, PARENT | — |
| PATCH | `/families/:id/subscription` | OWNER | `{ plan: PlanType, expiredAt? (ISO date) }` |

## Billing (`/families/:id/billing`)

| Method | Path | Roles | Body |
|---|---|---|---|
| GET | `/families/:id/billing/plans` | any active member | returns `{ plans: BillingPlan[] }` — static catalog, no auth-gated pricing logic |
| POST | `/families/:id/billing/subscribe` | OWNER | `{ plan: PlanType, billingCycle: "monthly" \| "yearly" }` — activates immediately (no payment provider integrated yet, see Known Gaps); returns the updated `Subscription` |
| GET | `/families/:id/billing/invoices` | OWNER, PARENT | returns `{ data: [], meta: { cursor: null, hasMore: false } }` — always empty until a payment provider is integrated (see Known Gaps) |

## Storage (`/families/:id/storage`)

| Method | Path | Roles | Notes |
|---|---|---|---|
| GET | `/families/:id/storage` | any active member | returns `FamilyStorageUsage` — bytes used vs. plan quota, broken down by photos/videos |

## Children (`/children`)

| Method | Path | Roles | Body / Query |
|---|---|---|---|
| POST | `/children` | OWNER, PARENT | `{ familyId, name, birthday (ISO date), gender: Gender, avatarUrl? }` |
| GET | `/children?familyId=<uuid>` | any active member | query: `familyId` (required) |
| GET | `/children/:id` | any active member | — |
| PATCH | `/children/:id` | OWNER, PARENT, CAREGIVER | any subset of create fields |
| DELETE | `/children/:id` | OWNER, PARENT | soft-delete |

## Dashboard (`/children/:id`)

| Method | Path | Roles | Notes |
|---|---|---|---|
| GET | `/children/:id/summary` | any active member | returns `ChildSummary` — child info + latest growth point + upcoming vaccination count + unread notification count, for the Home tab |
| GET | `/children/:id/activities/today` | any active member | returns `{ data: TodayActivityItem[] }` — notes/sleep/feeding records from today, merged and sorted newest-first |

## Timeline (`/children/:id/timeline`)

| Method | Path | Roles | Query |
|---|---|---|---|
| GET | `/children/:id/timeline` | any active member | `cursor?, limit?` — merged, cursor-paginated feed of Notes + Milestones |

## Notes (`/children/:childId/notes`)

| Method | Path | Roles | Body |
|---|---|---|---|
| POST | `/children/:childId/notes` | OWNER, PARENT, CAREGIVER | `{ title?, content, tags?: string[] }` |
| GET | `/children/:childId/notes` | any active member | pagination query |
| GET | `/children/:childId/notes/:noteId` | any active member | — |
| PATCH | `/children/:childId/notes/:noteId` | OWNER, PARENT, CAREGIVER | any subset of create fields |
| DELETE | `/children/:childId/notes/:noteId` | OWNER, PARENT, CAREGIVER | soft-delete |

## Milestones (`/children/:childId/milestones`)

| Method | Path | Roles | Body |
|---|---|---|---|
| POST | `/children/:childId/milestones` | OWNER, PARENT, CAREGIVER | `{ title, description?, milestoneDate (ISO date) }` |
| GET | `/children/:childId/milestones` | any active member | pagination query |
| PATCH | `/children/:childId/milestones/:milestoneId` | OWNER, PARENT, CAREGIVER | any subset of create fields |
| DELETE | `/children/:childId/milestones/:milestoneId` | OWNER, PARENT, CAREGIVER | soft-delete |

## Growth Records (`/children/:childId/growth-records`)

| Method | Path | Roles | Body / Query |
|---|---|---|---|
| POST | `/children/:childId/growth-records` | OWNER, PARENT | `{ weightKg?, heightCm?, headCircumCm?, recordedAt (ISO date) }` |
| GET | `/children/:childId/growth-records` | any active member | pagination query |
| GET | `/children/:childId/growth-records/trend?since=<ISO date>` | any active member | returns `{ points: GrowthTrendPoint[] }`, see [Response Data Models](#response-data-models) |
| PATCH | `/children/:childId/growth-records/:id` | OWNER, PARENT, CAREGIVER | any subset of create fields |
| DELETE | `/children/:childId/growth-records/:id` | OWNER, PARENT | soft-delete |

## Sleep Records (`/children/:childId/sleep-records`)

| Method | Path | Roles | Body / Query |
|---|---|---|---|
| POST | `/children/:childId/sleep-records` | OWNER, PARENT | `{ startedAt (ISO datetime), endedAt? }` |
| GET | `/children/:childId/sleep-records` | any active member | pagination query |
| GET | `/children/:childId/sleep-records/analytics?since=<ISO date>` | any active member | see Sleep analytics response model |
| PATCH | `/children/:childId/sleep-records/:id` | OWNER, PARENT, CAREGIVER | `{ startedAt?, endedAt? }` |
| DELETE | `/children/:childId/sleep-records/:id` | OWNER, PARENT | soft-delete |

## Feeding Records (`/children/:childId/feeding-records`)

| Method | Path | Roles | Body / Query |
|---|---|---|---|
| POST | `/children/:childId/feeding-records` | OWNER, PARENT | `{ category: FeedingType, amountMl?, recordedAt (ISO datetime) }` |
| GET | `/children/:childId/feeding-records` | any active member | pagination query |
| GET | `/children/:childId/feeding-records/analytics?since=<ISO date>` | any active member | see Feeding analytics response model |
| PATCH | `/children/:childId/feeding-records/:id` | OWNER, PARENT, CAREGIVER | any subset of create fields |
| DELETE | `/children/:childId/feeding-records/:id` | OWNER, PARENT | soft-delete |

## Vaccinations (`/children/:childId/vaccinations`)

| Method | Path | Roles | Body |
|---|---|---|---|
| POST | `/children/:childId/vaccinations` | OWNER, PARENT | `{ vaccineName, injectionDate?, status?: VaccineStatus (default UPCOMING) }` |
| GET | `/children/:childId/vaccinations` | any active member | pagination query |
| PATCH | `/children/:childId/vaccinations/reminder-settings` | OWNER, PARENT, CAREGIVER | `{ enabled? (default true), daysBefore? (1-60, default 7) }` — ⚠️ not yet persisted, echoes input (TODO: backing table) |
| PATCH | `/children/:childId/vaccinations/:id` | OWNER, PARENT, CAREGIVER | any subset of create fields |
| DELETE | `/children/:childId/vaccinations/:id` | OWNER, PARENT | soft-delete |

## Media / Album (`/children/:id/media`)

Two-step upload flow (Supabase Storage signed upload URL):

1. `POST /children/:id/media` → creates the `Media` record and returns a signed upload URL + token.
2. Client uploads the binary with `PUT <uploadUrl>` (token is embedded in the URL) **or** via the Supabase client SDK's `uploadToSignedUrl(path, token, file)`.

| Method | Path | Roles | Body / Query |
|---|---|---|---|
| POST | `/children/:id/media` | OWNER, PARENT, CAREGIVER | `{ type: MediaType, fileName, contentType, takenAt (ISO datetime), noteId? }` → returns `{ media, uploadUrl, uploadToken, key }` |
| GET | `/children/:id/media?groupBy=year\|month` | any active member | returns `[{ group: "2026" \| "2026-08", media: [...] }]` |
| PATCH | `/children/:id/media/:mediaId` | OWNER, PARENT, CAREGIVER | `{ caption?, albumId? }` — `albumId` must belong to the same child; clearing `albumId` back to unfiled isn't supported yet (omit the field, don't send `null`) |
| DELETE | `/children/:id/media/:mediaId` | OWNER, PARENT | soft-delete |

## Albums (`/children/:id/albums`)

| Method | Path | Roles | Body |
|---|---|---|---|
| POST | `/children/:id/albums` | OWNER, PARENT, CAREGIVER | `{ name }` |
| GET | `/children/:id/albums` | any active member | returns `{ data: Album[] }` |

## Notifications (`/notifications`)

| Method | Path | Roles | Body / Query |
|---|---|---|---|
| GET | `/notifications?familyId=<uuid>&unreadOnly?=true` | any active member | pagination query + `familyId` (required) |
| PATCH | `/notifications` | any active member | `{ familyId }` — marks all read |
| PATCH | `/notifications/:id/read` | any active member | — marks one read |

## AI (`/ai`) — stubbed, swappable provider

| Method | Path | Body |
|---|---|---|
| POST | `/ai/chat` | `{ prompt, childId? }` |
| POST | `/ai/journal` | `{ prompt, childId? }` |
| POST | `/ai/growth-analysis` | `{ prompt, childId? }` |
| POST | `/ai/milestone` | `{ prompt, childId? }` |

All four persist to `AiConversation` and currently return a mocked response (`StubAiProviderService`) — no real LLM key configured yet.

---

## Known Gaps

- Vaccination `reminder-settings` isn't backed by a persisted table yet — the value is validated and echoed back only.
- AI endpoints return stubbed output until a real provider is wired in.
- Google/Facebook/Apple OAuth need real credentials in `.env` to work end-to-end.
- `POST /auth/forgot-password` and `POST /auth/register` send OTP codes via Resend (`RESEND_API_KEY` in `.env`); with no key configured it falls back to logging the code server-side (`StubEmailProviderService`). The Resend account is currently in sandbox mode — it can only deliver to the account owner's verified address or Resend's `delivered@resend.dev` test address until a sending domain is verified; other recipients silently get the generic response with no email actually sent (logged as an error server-side).
- Email verification (`emailVerifiedAt`) is tracked but not enforced anywhere yet — unverified accounts can still log in and use every endpoint. Gate access on it later if the product requires that.
- OTP codes are stored in Redis (10-minute TTL, single-use, 5-attempt cap, 60s resend cooldown) — restarting Redis without persistence configured invalidates all pending codes.
- `PATCH /children/:id/media/:mediaId` can only set `albumId`, not clear it back to unfiled — sending `null` isn't supported by the current DTO.
- `POST /families/:id/billing/subscribe` activates the plan immediately with no payment step — no payment provider (Stripe, etc.) is integrated yet.
- `GET /families/:id/billing/invoices` always returns an empty list for the same reason — there's no invoice history to read yet.
- `GET /families/:id/storage` only counts `Media.sizeBytes` (photos/videos); text/note storage is not tracked. `sizeBytes` is only recorded for uploads where the client supplies it.
- `GET /children/:id/activities/today` and `.../summary`'s vaccination count scan the first 50–100 records per source rather than querying by date/status server-side — fine at typical volumes, may undercount for very active children.
