# Dev Notepad

Always check this file before analysis, building, or debugging.

---

## Best Practices

- Writing code is fast now
- Competitors move just as fast
- Users can build too
- If it's more than a few clicks, an agent should do it
- Assume users will bring their own agents

---

## Bugs & Fixes Log

### 1. Auth mismatch — API routes using `auth()` while app uses bypass
- **Symptom:** 401 Unauthorized on audit upload
- **Root cause:** `src/app/api/audit/upload/route.ts` used NextAuth `auth()` but the app uses `getCurrentUser()` bypass (hardcoded admin)
- **Fix:** Switch all API routes to use `getCurrentUser()` from `@/lib/auth-utils`
- **Lesson:** All auth must go through the same path. Check every API route uses `getCurrentUser()`, never `auth()`.

### 2. Null companyId for admin users
- **Symptom:** `companyId must not be null` error on upload
- **Root cause:** Auth bypass returns `companyId: null` for admin. Prisma requires a companyId for relations.
- **Fix:** Resolve first company from DB when admin user has no companyId
- **Lesson:** Admin users won't have a companyId. Always resolve it server-side when needed.

### 3. Sidebar not showing admin nav items
- **Symptom:** Sidebar showed only COMPANY_USER items even for admin
- **Root cause:** `useSession()` returned null with auth bypass, defaulting role to `COMPANY_USER`
- **Fix:** Pass user as prop from server-side layout instead of relying on client-side `useSession()`
- **Lesson:** With auth bypass, client-side session hooks don't work. Always pass user data from server components via props.

### 4. DATABASE_URL not available at Docker build time
- **Symptom:** Build failed on Railway — `prisma db push` couldn't connect
- **Root cause:** `prisma db push` was in the build script, but env vars aren't available during Docker build
- **Fix:** Move `prisma db push` to the start/CMD phase (runtime, not build time)
- **Lesson:** Never run DB commands during Docker build. DB operations go in CMD/start, not RUN.

### 5. Production DB missing new columns (`Company.contactEmail does not exist`)
- **Symptom:** Every page crashed with column-not-found errors after adding new schema fields
- **Root cause:** `nixpacks.toml` was controlling Railway startup (not the Dockerfile). Schema push wasn't running reliably.
- **Fix:**
  1. Created proper Prisma migration (`0_init/migration.sql`) with `IF NOT EXISTS` for idempotency
  2. Updated `nixpacks.toml` to run `prisma migrate deploy` + `prisma db push --accept-data-loss`
  3. Updated Dockerfile with same dual approach
- **Lesson:** Always check for `nixpacks.toml` / `Procfile` — they can override the Dockerfile CMD. Use both migrations AND db push for belt-and-suspenders reliability.

### 6. AI scoring was manual button-press, should be proactive
- **Symptom:** User had to click "Run AI Analysis" per company — friction
- **Root cause:** Design assumed manual trigger; AI scores overwrote the same score fields
- **Fix:** Auto-trigger AI on page load (useEffect), separate AI column vs Final Score column, "Accept All" button
- **Lesson:** "If it's more than a few clicks, an agent should do it." Make AI proactive, not reactive. Keep human override but don't require human initiation.

### 7. Audit upload broken — JSON body with file content
- **Symptom:** Upload fails silently or with body size errors
- **Root cause:** File content was read with `file.text()` (breaks PDFs) and sent as JSON string (hits body size limits)
- **Fix:** Switch to `FormData` upload on client, `request.formData()` on server. Use `Buffer.from(arrayBuffer)` for all file types.
- **Lesson:** Never send file content as JSON. Always use FormData for file uploads. Handle binary files (PDF) with ArrayBuffer, not `.text()`.

### 8. AI analysis not working — Anthropic SDK can't use Opper key
- **Symptom:** AI scoring silently fails or returns 503
- **Root cause:** `OPPER_KEY` is for Opper.ai (model orchestration), not a direct Anthropic API key. The Anthropic SDK sends requests to `api.anthropic.com` which rejects the Opper key.
- **Fix:** Replaced Anthropic SDK with plain `fetch` to Opper's OpenAI-compatible endpoint (`https://api.opper.ai/compat/openai/v1/chat/completions`). Auth via `x-opper-api-key` header. Model names use `provider/model` format (e.g. `anthropic/claude-sonnet-4-5-20250929`).
- **Lesson:** When using model orchestration tools (Opper, OpenRouter, LiteLLM), don't use provider-specific SDKs. Use the OpenAI-compatible endpoint with `fetch` or the OpenAI SDK. Check the auth header format — Opper uses `x-opper-api-key`, not `Authorization: Bearer`.

---

## Architecture Notes

- **Auth:** Real NextAuth v5 with credentials provider. `getCurrentUser()` reads the JWT session. Requires `NEXTAUTH_SECRET` env var. Login page at `/login`, register at `/register`.
- **Deploy:** Railway with Nixpacks (nixpacks.toml controls build + start). Dockerfile exists but may not be used.
- **DB:** PostgreSQL on Railway. Schema managed by Prisma. Use `prisma db push --accept-data-loss` for production schema sync.
- **AI:** Uses Opper.ai as model orchestration layer. API calls go to `https://api.opper.ai/compat/openai/v1/chat/completions` with `x-opper-api-key` header. Models use `provider/model` format. No provider-specific SDK needed.
- **Stack:** Next.js 16 (App Router), Prisma 5.22.0, Tailwind v4, Radix UI.
